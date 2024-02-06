import bcrypt from "bcrypt";
import { status } from "../config/responseStatus.js";
import {
  response,
  errResponse,
  customErrResponse,
} from "../config/response.js";
import User from "../schema/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
  removeRefreshToken,
} from "../middleware/jwtMiddleware.js";
import { deleteImage } from "../middleware/imageMiddleware.js";
import { smtpTransport } from "../config/email.js";

/*
 * API No. 1
 * API Name : 회원 가입 API
 * [POST] /auth/register
 * TO DO : S3 업로드 구현 후 이미지 업로드 로직 추가
 */
export const registUser = async (req, res, next) => {
  try {
    const { email, name, nickname, phone, birth, password } = req.body;
    const fileUrl =
      req.file && req.file.location
        ? req.file.location
        : "파일을 업로드하지 않았습니다."; // S3에 업로드 된 이미지 URL

    // 1. 이메일 유효성 검사
    if (validEmailCheck(email) == false) {
      return res.send(
        customErrResponse(
          status.BAD_REQUEST,
          "올바른 이메일 주소를 입력해주세요."
        )
      );
    }

    // 2. 핸드폰 유효성 검사
    if (validCallNumberCheck(phone) == false) {
      return res.send(
        customErrResponse(
          status.BAD_REQUEST,
          "올바른 핸드폰 번호를 입력해주세요."
        )
      );
    }

    // 3. 비밀번호 유효성 검사 (비밀번호는 숫자, 소문자, 대문자를 1개이상, 6~20자리 이내)
    if (validPasswordCheck(password) == false) {
      return res.send(
        customErrResponse(
          status.BAD_REQUEST,
          "올바른 비밀번호 형식을 지켜주세요."
        )
      );
    }

    // 4. 중복된 이메일인지 검사
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.send(errResponse(status.EMAIL_ALREADY_EXIST));
    }

    // 5. 중복된 닉네임인지 검사
    const existUser1 = await User.findOne({ nickname });
    if (existUser1) {
      return res.send(errResponse(status.NICKNAME_ALREADY_EXIST));
    }

    // 6. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      profile_image: fileUrl,
      nickname,
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
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 2
 * API Name : 로그인 API
 * [POST] /auth/login
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.send(errResponse(status.MEMBER_NOT_FOUND));
    }

    // 휴면 계정 or 5번 이상 신고 당한 계정
    if (user.status === "inactive") {
      return res.send(
        customErrResponse(
          status.BAD_REQUEST,
          "로그인할 수 없습니다. 서버에 문의해주세요."
        )
      );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.send(response(status.SUCCESS, { accessToken, refreshToken }));
  } catch (error) {
    console.error(error);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 3
 * API Name : 액세스 토큰 재발급 API
 * [POST] /auth/regenerate-token
 */
export const regenerateToken = async (req, res, next) => {
  const { _id, email } = req.user;

  try {
    const user = await User.findOne({ _id });
    const accessToken = generateAccessToken(user); // 액세스 토큰 재발급

    return res.send(response(status.SUCCESS, accessToken));
  } catch (error) {
    console.error(error);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 4
 * API Name : 로그아웃 API
 * [POST] /auth/logout
 */
export const logout = async (req, res, next) => {
  const { _id, email } = req.user;

  try {
    const user = await User.findOne({ _id });
    const result = await removeRefreshToken(user);

    return res.send(response(status.SUCCESS, result));
  } catch (error) {
    console.error(error);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 5
 * API Name : 회원 탈퇴 API
 * [PATCH] /auth/withdrawUser
 */
export const withdrawUser = async (req, res, next) => {
  const { _id, email } = req.user;

  try {
    await User.findOneAndUpdate(
      { email: email },
      { $set: { status: "inactive" } }
    );

    return res.send(response(status.SUCCESS));
  } catch (error) {
    console.error(error);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 6
 * API Name : 프로필 조회
 * [GET] /auth/profile
 */
export const getUserInfo = async (req, res, next) => {
  const { _id, email } = req.user;

  try {
    const user = await User.findOne({ email });

    return res.send(response(status.SUCCESS, user));
  } catch (error) {
    console.error(error);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 7
 * API Name : 프로필 수정
 * [PATCH] /auth/update
 */
export const updateUserInfo = async (req, res, next) => {
  const { _id, email } = req.user;
  const { nickname, phone, password } = req.body;
  const fileUrl =
    req.file && req.file.location
      ? req.file.location
      : "파일을 업로드하지 않았습니다."; // S3에 업로드 된 이미지 URL

  try {
    // nickname 수정 시, nickname 중복 확인
    if (nickname) {
      const existUser = await User.findOne({ nickname });
      if (existUser) {
        return res.send(errResponse(status.NICKNAME_ALREADY_EXIST));
      }
    }

    // phone 수정 시, phone 유효성 검사
    if (phone) {
      if (validCallNumberCheck(phone) == false) {
        return res.send(
          customErrResponse(
            status.BAD_REQUEST,
            "올바른 핸드폰 번호를 입력해주세요."
          )
        );
      }
    }

    // password 수정 시, password 유효성 검사 & 암호화
    let hashedPassword;

    if (password) {
      if (validPasswordCheck(password) == false) {
        return res.send(
          customErrResponse(
            status.BAD_REQUEST,
            "올바른 비밀번호 형식을 지켜주세요."
          )
        );
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // S3 업로드 된 이미지 삭제
    const findUser = await User.findOne({ email });

    if (
      findUser.profile_image &&
      findUser.profile_image !== "파일을 업로드하지 않았습니다."
    ) {
      const fileKey = findUser.profile_image;
      await deleteImage(fileKey);
      console.log("이미지 삭제 성공");
    }

    const updateUser = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          nickname: nickname,
          phone: phone,
          profile_image: fileUrl,
          password: hashedPassword,
        },
      },
      { new: true }
    );

    return res.send(response(status.SUCCESS, updateUser));
  } catch (error) {
    console.log(error);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 8
 * API Name : 이메일 인증 API
 * [POST] /auth/check-email
 */
export const checkEmail = async (req, res, next) => {
  const { email } = req.body;
  const code = generateRandomCode();

  try {
    // 이메일 유효성 검사
    if (validEmailCheck(email) == false) {
      return res.send(
        customErrResponse(
          status.BAD_REQUEST,
          "올바른 이메일 주소를 입력해주세요."
        )
      );
    }

    const mailOptions = {
      from: process.env.NODE_MAILER_ID,
      to: email,
      subject: "[Blood Trail] 이메일 인증 번호",
      html: "<h1>인증번호를 입력해주세요</h1><br>" + code,
    };

    await smtpTransport.sendMail(mailOptions);

    return res.send(response(status.SUCCESS, code));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 9
 * API Name : 비밀번호 찾기 API
 * [PATCH] /auth/find-password
 */
export const findPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // 이메일에 해당하는 사용자 검색
    const user = await User.findOne({ email });

    if (!user) {
      return res.send(errResponse(status.MEMBER_NOT_FOUND));
    }

    // 새로운 비밀번호 생성
    const newPassword = generateRandomPassword();

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 사용자 정보 수정
    user.password = hashedPassword;
    await user.save();

    // 새로운 비밀번호 전송
    const mailOptions = {
      from: process.env.NODE_MAILER_ID,
      to: email,
      subject: "[Blood Trail] 비밀번호 찾기",
      html:
        `<h1>새로운 비밀번호 안내</h1><p>새로운 비밀번호는 ${newPassword} 입니다.</p>` +
        `<p>로그인 후 비밀번호를 변경해주세요.</p>`,
    };

    await smtpTransport.sendMail(mailOptions);

    return res.send(response(status.SUCCESS));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*************************************************************************************/
// 이메일 유효성 검사
export const validEmailCheck = (email) => {
  const pattern =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return pattern.test(email);
};

// 핸드폰 번호 유효성 검사
export const validCallNumberCheck = (phone) => {
  //유효성 검사
  const pattern =
    /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/;
  return pattern.test(phone.replace(/-/g, "")); // phone.replace(/-/g, "") -> - 삭제
};

// 비밀번호 유효성 검사
export const validPasswordCheck = (password) => {
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return pattern.test(password);
};

// 랜덤 이메일 인증 번호 생성
export const generateRandomCode = () => {
  var code = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
  return code;
};

// 랜덤 패스워드 생성
export const generateRandomPassword = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

  let password = "";

  password += getRandomChar("0123456789");
  password += getRandomChar("abcdefghijklmnopqrstuvwxyz");
  password += getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  const remainLength = Math.floor(Math.random() * (20 - password.length)) + 6;

  for (let i = 0; i < remainLength; i++) {
    const index = Math.floor(Math.random() * charset.length);
    password += charset[index];
  }

  return password;
};

// 랜덤 문자열 선택
export const getRandomChar = (charset) => {
  const index = Math.floor(Math.random() * charset.length);
  return charset[index];
};
