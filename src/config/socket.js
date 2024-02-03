import SocketIO from "socket.io";
import { deleteChatRoom } from "../controller/chatRoomController.js";

export default function socketConnect(server, app) {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);

  // 네임스페이스 = 소켓 url에서 엔드 포인트 역할
  const room = io.of("/chatRoom"); // 네임스페이스 /chatRoom 생성
  const chat = io.of("/chat"); // 네임스페이스 /chat 생성

  // /chatRoom 네임스페이스 전용 이벤트
  room.on("connection", (socket) => {
    console.log("chatRoom 네임스페이스에 접속");

    socket.on("disconnect", () => {
      console.log("chatRoom 네임스페이스 접속 해제");
    });
  });

  // /chat 네임스페이스 전용 이벤트
  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스에 접속");
    const { referer } = socket.request.headers; // 서버한테 요청한 클라이언트 uri 정보 추출

    // 채팅방 입장
    socket.on("join", (data) => {
      const { nickname, chatRoomId } = data;

      socket.join(chatRoomId); // 해당 소켓을 /chatRoom에 넣어주기 (소켓 분리)
      socket.to(chatRoomId).emit("join", {
        writer: {
          id: "65bcebea6f30de27fc4f39fc", // TO DO : 배포 DB에 맞게 수정 필요
          nickname: "system",
        }, // 유저는 나 / 상대방 / 시스템으로 3가지 (시스템 = 알림 역할)
        message: `${nickname}님이 입장하셨습니다.`,
      });
    });

    // 채팅방 퇴장
    socket.on("exit", () => {
      const currentChatRoom = chat.adapter.rooms.get(chatRoomId);
      const userCount = currentChatRoom?.size || 0;

      /*
        1. 방에 남아있는 인원이 1명 -> 채팅방 삭제
        2. 방에 남아있는 인원이 2명 이상 -> 채팅방 퇴장
      */
      if (userCount === 1) {
        deleteChatRoom(chatRoomId); // 채팅방 삭제는 시스템만 가능
        room.emit("removeRoom", chatRoomId);
        console.log("방 제거 요청 성공");
      } else {
        socket.to(chatRoomId).emit("exit", {
          writer: {
            id: "65bcebea6f30de27fc4f39fc", // TO DO : 배포 DB에 맞게 수정 필요
            nickname: "system",
          }, // 유저는 나 / 상대방 / 시스템으로 3가지 (시스템 = 알림 역할)
          message: `${nickname}님이 퇴장하셨습니다.`,
        });
        socket.leave(chatRoomId); // 채팅방 나가기
      }
    });

    socket.on("disconnect", async () => {
      console.log("chat 네임스페이스 접속 해제");
    });
  });
}
