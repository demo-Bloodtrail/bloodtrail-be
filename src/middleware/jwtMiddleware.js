import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import { status } from "../config/responseStatus.js";
import { BaseError } from "../config/error.js";

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
        reject(new BaseError(status.UNAUTHORIZED));
      } else if (token === data) {
        // 리프레시 토큰과 Redis에 저장된 토큰의 일치 여부 검사
        jwt.verify(token, secret);
        resolve();
      } else {
        console.log("Invalid Refresh Token");
        reject(new BaseError(status.UNAUTHORIZED));
      }
    });
  });
};
