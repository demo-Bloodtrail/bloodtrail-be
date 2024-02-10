import { status } from "../config/responseStatus.js";
import {
  response,
  errResponse,
  customErrResponse,
} from "../config/response.js";
import ChatRoom from "../schema/chatRoom.js";
import Chat from "../schema/chat.js";
import User from "../schema/user.js";

/*
 * Socket.IO Methods
 *
 * io.emit() : 연결되어 있는 모든 클라이언트에게 전송
 * socket.broadcast.emit() : 메시지를 전송한 클라이언트를 제외하고 나머지 모든 클라이언트에게 전송
 * socket.emit() : 서버에 메시지를 전송한 클라이언트에게만 전송
 * io.to(id).emit() : id에게만 전송
 */

export const renderMain = async (req, res, next) => {
  try {
    const chatRooms = await ChatRoom.find({});
    res.render("main", { chatRooms, title: "채팅방" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const renderRoom = (req, res) => {
  res.render("chatRoom", { title: "채팅방 생성" });
};

/*
 * API No. 1
 * API Name : 채팅방 생성 API
 * [POST] /chatRoom
 */
export const postChatRoom = async (req, res, next) => {
  try {
    const { _id, email } = req.user;
    const newChatRoom = new ChatRoom({
      joiner: _id,
      type: req.body.type,
      title: req.body.title,
    });

    const savedChatRoom = await newChatRoom.save();
    const io = req.app.get("io"); // io 가져오기

    /*
      io.emit 현재 소켓 서버에 접속한 모든 사용자에게 메시지 전송
      
      1. io.of("/room") -> /room 네임스페이스의 Socket.IO 객체 반환
      2. emit("newRoom", saevdChatRoom) -> newRoom 이벤트 발생 + 방 정보 savedChatRoom 클라이언트에게 전송
      3. 클라이언트에서는 채팅방 목록 업데이트
    */
    io.of("/chatRoom").emit("newRoom", savedChatRoom);
    const chatRoomURI = "/chatRoom/" + savedChatRoom._id;

    console.log("chatRoomURI:" + chatRoomURI);
    return res.send(response(status.SUCCESS, chatRoomURI)); // 채팅방 주소 반환
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 2
 * API Name : 내가 참여중인 채팅방 전체 조회 API
 * [GET] /chatRoom/all
 */
export const getChatRooms = async (req, res, next) => {
  try {
    const { _id, email } = req.user;
    const chatRooms = await ChatRoom.find({ joiner: _id });

    if (!chatRooms || chatRooms.length === 0) {
      return res.send(
        errResponse(
          status.BAD_REQUEST,
          "해당 유저가 참여하고 있는 채팅방이 존재하지 않습니다."
        )
      );
    }

    const chatRoomsWithChat = [];

    // 채팅방 별 가장 최근 메시지 or 이미지 찾기
    for (const chatRoom of chatRooms) {
      const recentChat = await Chat.findOne({ chatRoom: chatRoom._id })
        .sort({ created_at: -1 })
        .select("message image");

      chatRoomsWithChat.push({
        chatRoom: chatRoom.toObject(),
        recentChat: recentChat ? recentChat.message || recentChat.image : null,
      });
    }
    return res.send(response(status.SUCCESS, { chatRoomsWithChat }));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 3
 * API Name : 특정 채팅방 조회 API (채팅방 들어가기)
 * [GET] /chatRoom/:chatRoomId
 */
export const getChatRoom = async (req, res, next) => {
  try {
    const { _id, email } = req.user;
    const user = await User.findById(_id);
    const chatRoom = await ChatRoom.findOne({ _id: req.params.chatRoomId });

    if (!chatRoom) {
      return res.send(
        customErrResponse(status.BAD_REQUEST, "존재하지 않는 방입니다.")
      );
    }

    // 참여자에 내가 없으면 추가
    if (!chatRoom.joiner.includes(_id)) {
      chatRoom.joiner.push(_id);
      await chatRoom.save();
    }

    // TO DO : 프론트 요청 시 페이징 처리
    const chats = await Chat.find({ chatRoom: chatRoom._id }).sort(
      "created_at"
    );

    // 프론트 테스트용
    // res.render("chat", {
    //   chatRoom,
    //   title: chatRoom.title,
    //   chats,
    //   nickname: user.nickname,
    // });
    return res.send(
      response(status.SUCCESS, {
        chatRoom,
        title: chatRoom.title,
        chats,
        nickname: user.nickname,
      })
    );
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 4
 * API Name : 채팅방 삭제 API
 * [DELETE] /chatRoom/:chatRoomId
 */
export const deleteChatRoom = async (req, res, next) => {
  try {
    const chatRoomId = req.params.chatRoomId;
    console.log("chatRoomId: " + chatRoomId);

    await Room.deleteOne({ _id: chatRoomId }); // 채팅방 삭제
    await Chat.deleteMany({ chatRoom: chatRoomId }); // 채팅 삭제
    return res.send(response(status.SUCCESS, "채팅방 삭제 성공"));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 5
 * API Name : 채팅 메시지 전송 API
 * [POST] /chatRoom/:chatRoomId/chat
 */
export const postChatMessage = async (req, res, next) => {
  console.log("채팅 메시지 전송 API 시작");

  try {
    const { _id, email } = req.user;
    const user = await User.findById(_id);

    const newChat = new Chat({
      chatRoom: req.params.chatRoomId,
      writer: {
        id: user._id,
        nickname: user.nickname,
      },
      message: req.body.message,
    });
    const savedChat = await newChat.save();

    // /chat 네임스페이스 + chatRoomId 방에 속한 클라이언트에게만 채팅 전송
    req.app
      .get("io")
      .of("/chat")
      .to(req.params.chatRoomId)
      .emit("chat", savedChat);
    return res.send(response(status.SUCCESS, "채팅 메시지 전송 성공"));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 5
 * API Name : 채팅 이미지 전송 API
 * [POST] /chatRoom/:chatRoomId/image
 */
export const postChatImage = async (req, res, next) => {
  try {
    const fileUrl =
      req.file && req.file.location
        ? req.file.location
        : "파일을 업로드하지 않았습니다."; // S3에 업로드 된 이미지 URL
    const { _id, email } = req.user;
    const user = await User.findById(_id);

    const newChat = new Chat({
      chatRoom: req.params.chatRoomId,
      writer: {
        id: user._id,
        nickname: user.nickname,
      },
      image: fileUrl,
    });
    const savedChat = await newChat.save();

    // /chat 네임스페이스 + chatRoomId 방에 속한 클라이언트에게만 채팅 전송
    req.app
      .get("io")
      .of("/chat")
      .to(req.params.chatRoomId)
      .emit("chat", savedChat);
    return res.send(response(status.SUCCESS, "채팅 이미지 전송 성공"));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 6
 * API Name : 채팅 나가기 (퇴장) API
 * [PATCH] /chatRoom/:chatRoomId
 */
export const patchChatRoom = async (req, res, next) => {
  try {
    const { _id, email } = req.user;
    const chatRoomId = req.params.chatRoomId;

    const updatedChatRoom = await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      { $pull: { joiner: _id } },
      { new: true }
    );

    if (!updatedChatRoom) {
      return res.send(
        errResponse(status.BAD_REQUSET, "해당 채팅방은 존재하지 않습니다.")
      );
    }

    return res.send(response(status.SUCCESS, "채팅방 퇴장 성공"));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};
