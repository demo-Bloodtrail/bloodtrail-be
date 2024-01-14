import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // .env 파일 사용 (환경 변수 관리)

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

export const connect = () => {
  // dev 모드일 때, 실행 시 쿼리 출력 (디버깅 모드)
  if (process.env.NODE_ENV !== "prod") {
    mongoose.set("debug", true);
  }
  // mongodb://아이디:비밀번호@주소
  mongoose
    .connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("MongoDB connected!");
    })
    .catch((err) => {
      console.error("MongoDB connection error", err);
    });
};

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB connection has been lost! Attempting to reconnect.");
  connect();
});

export default mongoose;
