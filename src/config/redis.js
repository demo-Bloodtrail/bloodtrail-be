import dotenv from "dotenv";
import * as redis from "redis";

dotenv.config(); // .env 파일 사용 (환경 변수 관리)

// redisClient 생성
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// redis tjqj 서버 연결 (v.4 이상부터는 꼭 써줘야 한다!!!!!!!!!)
redisClient.connect();

redisClient.on("connect", () => {
  console.info("Redis connected!");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export default redisClient;
