import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "prod" ? ".env.prod" : ".env.dev";
dotenv.config({ path: envFile }); // .env 파일 사용 (환경 변수 관리)
const secret = process.env.JWT_SECRET;

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    birth: {
      type: Date,
      required: true,
    },
    profile_image: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    // 포인트
    point: {
      type: Number,
      default: 0,
    },
    // 포인트에 대한 배지
    badge: {
      type: String,
    },
    // 프리미엄 결제 여부
    premium: {
      payment: {
        type: Boolean,
        default: false,
        required: true,
      },
      merchant_uid: {
        type: String,
      },
      imp_uid: {
        type: String,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
    },
    // 소속 크루
    crew: {
      type: ObjectId,
      ref: "Crew",
    },
    // 상태
    status: {
      type: String,
      required: true,
      default: "active",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false } // 데이터 삽입 시 __v 칼럼 생성 X
);

const User = mongoose.model("User", userSchema);
export default User;
