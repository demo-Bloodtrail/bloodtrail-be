import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "prod" ? ".env.prod" : ".env.dev";
dotenv.config({ path: envFile }); // .env 파일 사용 (환경 변수 관리)
