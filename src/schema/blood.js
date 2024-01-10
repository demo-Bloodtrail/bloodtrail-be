import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const bloodSchema = new Schema({
  // 작성자
  writer: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
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
  // 글 이미지
  image: {
    type: [String], // 여러개의 이미지를 리스트 형태로 가짐
    required: true,
  },
  // 혈액형
  blood_type: {
    type: String,
    enum: ["A", "AB", "B", "O"],
    required: true,
  },
  // 필요 혈액제제
  blood_product: {
    type: String,
    enum: ["WB", "RBC", "PC", "FFP"],
    required: true,
  },
  // 시작 날짜
  start_date: {
    type: Date,
    required: true,
  },
  // 종료 날짜
  end_date: {
    type: Date,
    required: true,
  },
  // 수혈자 번호
  receiver: {
    type: String,
    required: true,
  },
  // 병원 정보
  hosipital: {
    type: Schema.Types.Mixed, // (String, Number) 타입을 가짐
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

const Blood = mongoose.model("Blood", bloodSchema);
export default Blood;
