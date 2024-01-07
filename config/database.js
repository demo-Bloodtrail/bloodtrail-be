import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connect = () => {
  // dev 모드일 때, 실행 시 쿼리 출력 (디버깅 모드)
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
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
