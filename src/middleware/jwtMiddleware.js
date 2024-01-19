import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import { status } from "../config/responseStatus.js";
import { errResponse } from "../config/response.js";
import { REPL_MODE_SLOPPY } from "repl";

dotenv.config(); // .env 파일 사용 (환경 변수 관리)

const secret = process.env.JWT_SECRET;

// access token 발급
export const generateAccessToken = (user) => {
  const payload = {
    // access token에 들어갈 payload
    _id: user._id,
    email: user.email,
  };

  // secret으로 sign하여 발급하고 return
  return jwt.sign(payload, secret, {
    algorithm: "HS256", // 암호화 알고리즘
    expiresIn: "1h", // 유효기간 = 1시간
  });
};

// access token 검증
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      ok: true,
      _id: decoded._id,
      email: decoded.email,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

// refresh token 발급
export const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({}, secret, {
    // refresh token은 payload 없이 발급
    algorithm: "HS256", // 암호화 알고리즘
    expiresIn: "14d", // 유효기간 = 14일
  });
  redisClient.set(user._id.toString(), refreshToken); // <사용자 ID, refreshToken>을 redis에 저장
  return refreshToken;
};

// refresh token 검증
export const verifyRefreshToken = (token, userId) => {
  return new Promise((resolve, reject) => {
    redisClient.get(userId.toString(), (err, data) => {
      if (err) {
        console.log("레디스랑 연결해서 get했는데 err낫음");
        reject(errResponse(status.UNAUTHORIZED));
      } else if (token === data) {
        // 리프레시 토큰과 Redis에 저장된 토큰의 일치 여부 검사
        console.log("리프레시랑 레디스 토큰 일치 여부 검사");
        const decoded = jwt.verify(token, secret);
        console.log("일치함");
        resolve(decoded.email);
      } else {
        console.log("Invalid Refresh Token");
        reject(errResponse(status.UNAUTHORIZED));
      }
    });
  });
};

// refresh token 삭제
export const removeRefreshToken = (user) => {
  return new Promise((resolve, reject) => {
    const result = redisClient.del(user._id.toString());
    resolve(result);
  });
};

// // refresh token 삭제
// export const removeRefreshToken = (user) => {
//   return new Promise((resolve, reject) => {
//     redisClient.del(user._id.toString(), (err, reply) => {
//       if (err) {
//         console.log('Redis와 연결 후 DEL 실패');
//         reject(errResponse(status.UNAUTHORIZED));
//       } else if (reply === 1) {
//         console.log('Redis에서 Refresh Token 삭제');
//         resolve(reply);
//       } else {
//         console.log('Redis에서 사용자와 일치하는 Refresh Token이 없음');
//         reject(errResponse(status.UNAUTHORIZED));
//       }
//     });
//   });
// };