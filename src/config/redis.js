import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config(); // .env 파일 사용 (환경 변수 관리)

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

// redisClient 생성
// const redisClient = redis.createClient({
//   port: REDIS_PORT,
//   host: REDIS_HOST,
// });
const redisClient = createClient({ url: process.env.REDIS_URL });

// redis tjqj 서버 연결 (v.4 이상부터는 꼭 써줘야 한다!!!!!!!!!)
redisClient.connect();

redisClient.on("connect", () => {
  console.info("Redis connected!");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export default redisClient;
