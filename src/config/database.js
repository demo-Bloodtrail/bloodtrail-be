import mongoose from "mongoose";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "prod" ? ".env.prod" : ".env.dev";
dotenv.config({ path: envFile }); // .env 파일 사용 (환경 변수 관리)

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
      console.log("몽고디비 연결 성공");
    })
    .catch((err) => {
      console.error("몽고디비 연결 에러", err);
    });
};

mongoose.connection.on("error", (error) => {
  console.error("몽고디비 연결 에러", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
  connect();
});

export default mongoose;
