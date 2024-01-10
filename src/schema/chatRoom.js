import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const chatRoomSchema = new Schema({
  // 방장
  owner: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  // 채팅방 종류
  type: {
    type: String,
    enum: ["live", "crew", "blood"], // 순서대로 라이브, 크루, 지정헌혈
    required: true,
  },
  // 생성일
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  // 수정일
  updated_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;
