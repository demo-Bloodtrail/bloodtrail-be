import jwt from "jsonwebtoken";
import { verifyAccessToken, verifyRefreshToken } from "./jwtMiddleware";
import { errResponse, customErrResponse } from "../config/response.js";
import { status } from "../config/responseStatus.js";

// 1. 액세스 토큰 유효성 검사 + 토큰에서 유저 정보 추출
export const authenticateUser = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization; // 헤더에서 토큰 추출

  // 1. Authorization 헤더가 없는 경우
  if (!authorizationHeader) {
    const error = customErrResponse(
      status.UNAUTHORIZED,
      "Authorization 헤더에 토큰이 담기지 않았습니다."
    );
    return next(res.send(error));
  }

  // 2. Authorization 헤더의 값이 'Bearer token' 형식인지 확인
  const [type, token] = authorizationHeader.split(" "); // type = 'Bearer'

  // 3. access token 유효성 검사
  const result = verifyAccessToken(token);
  if (!result.ok) {
    if (result.message == "jwt expired") {
      return next(
        res.send(
          customErrResponse(
            status.UNAUTHORIZED,
            "액세스 토큰을 재발급 받으세요."
          )
        )
      );
    }
    const error = customErrResponse(status.UNAUTHORIZED, result.message);
    return next(res.send(error));
  }

  // 4. 유효성 검사 통과 후 요청에 사용자 정보 추가
  req.user = {
    _id: result._id,
    email: result.email,
  };

  // 5. 원래 API 처리하러 넘어가기
  next();
};

/***********************************************************/

// 2. 리프레시 토큰 유효성 검사
export const authenticateWithRefresh = async (req, res, next) => {
  const accessToken = req.headers.authorization; // 액세스 토큰 추출
  const refreshToken = req.headers.refresh; // 리프레시 토큰 추출

  // 1. 헤더에 토큰이 담기지 않은 경우
  if (!accessToken || !refreshToken) {
    const error = customErrResponse(
      status.UNAUTHORIZED,
      "Header에 토큰이 담기지 않았습니다."
    );
    return next(res.send(error));
  }

  // 2. Authorization 헤더의 값이 'Bearer token' 형식인지 확인
  const [type, access] = accessToken.split(" ");
  const [type1, refresh] = refreshToken.split(" ");

  // 3. 만료된 AccessToken을 디코딩해서 id 추출
  const decoded = jwt.decode(access);
  if (!decoded) {
    const error = errResponse(status.UNAUTHORIZED);
    return next(res.send(error));
  }

  // 4. refresh token 유효성 검사
  const result = await verifyRefreshToken(refresh, decoded._id, res);
  console.log("result: " + result);
  if (result == "jwt expired") {
    return res.send(
      customErrResponse(
        status.UNAUTHORIZED,
        "리프레시 토큰이 만료되었으니 다시 로그인해주세요."
      )
    );
  }

  // 5. 유효성 검사 통과 후 요청에 사용자 정보 추가
  req.user = {
    _id: decoded._id,
    email: result,
  };

  // 6. 원래 API 처리하러 넘어가기
  next();
};
