import bcrypt from "bcrypt";
import { status } from "../config/responseStatus.js";
import { BaseError } from "../config/error.js";
import { response } from "../config/response.js";
import User from "../schema/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/jwtMiddleware.js";

// 회원가입 (유효성 검사 + 이미지 저장 + 이메일 인증 추가해야 함)
export const registUser = async (req, res, next) => {
  console.log("회원가입을 요청하였습니다!");

  try {
    const { email, name, phone, birth, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      // 중복된 이메일인지 검사
      return new BaseError(status.EMAIL_ALREADY_EXIST);
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      phone,
      birth,
      password: hashedPassword,
      premium: false,
    });

    const savedUser = await newUser.save();
    console.log("savedUser: " + savedUser);

    return res.send(response(status.SUCCESS, savedUser));
  } catch (err) {
    console.error(err);
    return new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};

// 로그인
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      // 비밀번호 일치 여부 검사
      return new BaseError(status.UNAUTHORIZED);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.send(response(status.SUCCESS, { accessToken, refreshToken }));
  } catch (error) {
    console.error(error);
    return new BaseError(status.INTERNAL_SERVER_ERROR);
  }
};
