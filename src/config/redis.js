import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config(); // .env 파일 사용 (환경 변수 관리)

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

/*
  redisClient 생성 (import * as redis from "redis")
  배포 서버에서 elastic cache redis 엔드포인트가 아닌 localhost로 접속 시도해서 econnrefused 에러

  Redis Client Error Error: connect ECONNREFUSED 127.0.0.1:6379
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1555:16) {
    errno: -111,
    code: 'ECONNREFUSED',
    syscall: 'connect',
    address: '127.0.0.1',
    port: 6379
  }

  const redisClient = redis.createClient({
    port: REDIS_PORT,
    host: REDIS_HOST,
  });
*/

const redisClient = createClient({ url: process.env.REDIS_URL });

// redis 서버 연결 (v.4 이상부터는 꼭 써줘야 한다!!!!!!!!!)
redisClient.connect();

redisClient.on("connect", () => {
  console.info("Redis connected!");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export default redisClient;
