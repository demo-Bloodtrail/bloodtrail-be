import { verifyAccessToken, verifyRefreshToken } from "./jwtMiddleware";
import { BaseError } from "../config/error.js";
import { status } from "../config/responseStatus.js";

export const authenticateUser = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization; // 헤더에서 토큰 추출

  // 1. Authorization 헤더가 없는 경우
  if (!authorizationHeader) {
    const error = new BaseError(
      stataus.UNAUTHORIZED,
      "Authorization 헤더에 토큰이 담기지 않았습니다."
    );
    return next(error);
  }

  // 2. Authorization 헤더의 값이 'Bearer token' 형식인지 확인
  const [type, token] = authorizationHeader.split(" ");
  if (type !== "Bearer" || !token) {
    const error = new BaseError(
      stataus.UNAUTHORIZED,
      "올바른 Bearer 토큰이 제공되지 않았습니다."
    );
    return next(error);
  }

  // 3. access token 유효성 검사
  const result = verifyAccessToken(token);
  if (!result.ok) {
    const error = new BaseError(
      status.UNAUTHORIZED,
      verificationResult.message
    );
    return next(error);
  }

  // 4. 유효성 검사 통과 후 요청에 사용자 정보 추가
  req.user = {
    _id: result._id,
    email: result.email,
  };

  // 5. 원래 API 처리하러 넘어가기
  next();
};
