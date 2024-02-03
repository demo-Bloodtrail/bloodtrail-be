import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const bloodSchema = new Schema(
  {
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
      enum: ["A+", "AB+", "B+", "O+", "A-", "AB-", "B-", "O-"],
      required: true,
    },
    /*
      필요 혈액제제

      - WB : 전혈
      - RBC : 농축적혈구
      - F-RBC : 백혈구여과제거적혈구
      - W-RBC : 세척적혈구
      - WBC : 농축백혈구
      - PLT : 농축혈소판
      - A-PLT : 백혈구여과제거성분채혈혈소판
      - W-PLT : 세척혈소판
      - FFP : 신선동결혈장
      - FP : 동결혈장
      - CRYO : 동결침전제제
      - CR-P : 동결침전물제거혈장
    */
    blood_product: {
      type: String,
      enum: [
        "WB",
        "RBC",
        "F-RBC",
        "W-RBC",
        "WBC",
        "PLT",
        "A-PLT",
        "W-PLT",
        "FFP",
        "FP",
        "CRYO",
        "CR-P",
      ],
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
    hospital: {
      type: Schema.Types.Mixed, // (String, Number) 타입을 가짐
      required: true,
    },
    // 조회수
    views: {
      type: Number,
      default: 0,
    },
    // 좋아요 누른 유저
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    // 좋아요 개수
    likeCount: {
      type: Number,
      default: 0,
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

const Blood = mongoose.model("Blood", bloodSchema);
export default Blood;
