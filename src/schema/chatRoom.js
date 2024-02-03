import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const chatRoomSchema = new Schema(
  {
    // 채팅 참여자
    joiner: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    // 채팅방 종류
    type: {
      type: String,
      /*
        free = 자유 라이브
        ing = 나 지금 헌혈 중 라이브
        story = 헌혈 이야기 공유 라이브
        crew = 크루
        blood = 지정헌혈
      */
      enum: ["free", "ing", "story", "crew", "blood"], //
      required: true,
    },
    // 채팅방 이름
    title: {
      type: String,
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
  },
  { versionKey: false } // 데이터 삽입 시 __v 칼럼 생성 X);
);

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;
