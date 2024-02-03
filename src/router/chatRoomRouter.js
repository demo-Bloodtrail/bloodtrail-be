import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  postChatRoom,
  getChatRooms,
  getChatRoom,
  deleteChatRoom,
  postChatMessage,
  postChatImage,
  patchChatRoom,
  renderMain,
  renderRoom,
} from "../controller/chatRoomController.js";
import { uploadOne } from "../middleware/imageMiddleware.js";

export const chatRoomRouter = express.Router();

/* 채팅 프론트 테스트를 위해 추가 */
chatRoomRouter.get("/render", renderMain); // 메인 화면
chatRoomRouter.get("", renderRoom); // 채팅방 생성 렌더링 화면

/**********************************************************/
/* TO DO : 채팅 신고 api 추가 */
chatRoomRouter.post("", authenticateUser, postChatRoom); // 채팅방 생성
chatRoomRouter.get("/all", authenticateUser, getChatRooms); // 내가 참여중인 채팅방 전체 조회
chatRoomRouter.get("/:chatRoomId", authenticateUser, getChatRoom); // 특정 채팅방 조회 (특정 채팅방 입장)
chatRoomRouter.delete("/:chatRoomId", deleteChatRoom); // 채팅방 삭제
chatRoomRouter.patch("/:chatRoomId", authenticateUser, patchChatRoom); // 채팅방 퇴장
chatRoomRouter.post("/:chatRoomId/chat", authenticateUser, postChatMessage); // 채팅 메시지 전송
chatRoomRouter.post(
  "/:chatRoomId/image",
  authenticateUser,
  uploadOne.single("file"),
  postChatImage
); // 채팅 이미지 전송
