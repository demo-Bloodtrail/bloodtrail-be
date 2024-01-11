import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const advertisementSchema = new Schema({
  // 글 제목
  title: {
    type: String,
    required: true,
  },
  // 글 내용
  content: {
    type: String,
    required: true,
  },
  // 크루
  crew: {
    type: ObjectId,
    required: true,
    ref: "Crew",
  },
  // 작성자 (크루 리더)
  writer: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  // 조회수
  view: {
    type: Number,
    required: true,
    default: 0,
  },
  // 생성일
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);
export default Advertisement;
