import { StatusCodes } from "http-status-codes";

export const status = {
  // success
  SUCCESS: {
    status: StatusCodes.OK,
    isSuccess: true,
    code: 2000,
    message: "SUCCESS!",
  },

  // error
  // common err
  INTERNAL_SERVER_ERROR: {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    isSuccess: false,
    code: "COMMON000",
    message: "서버 에러, 관리자에게 문의 바랍니다.",
  },
  BAD_REQUEST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "COMMON001",
    message: "잘못된 요청입니다.",
  },
  UNAUTHORIZED: {
    status: StatusCodes.UNAUTHORIZED,
    isSuccess: false,
    code: "COMMON002",
    message: "권한이 잘못되었습니다.",
  },
  METHOD_NOT_ALLOWED: {
    status: StatusCodes.METHOD_NOT_ALLOWED,
    isSuccess: false,
    code: "COMMON003",
    message: "지원하지 않는 Http Method 입니다.",
  },
  FORBIDDEN: {
    status: StatusCodes.FORBIDDEN,
    isSuccess: false,
    code: "COMMON004",
    message: "금지된 요청입니다.",
  },

  // member err
  MEMBER_NOT_FOUND: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MEMBER4001",
    message: "사용자가 없습니다.",
  },
  NICKNAME_ALREADY_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MEMBER4002",
    message: "이미 존재하는 닉네임입니다.",
  },
  EMAIL_ALREADY_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MEMBER4003",
    message: "이미 존재하는 이메일입니다.",
  },
  MAIL_SEND_FAIL: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "MEMBER4004",
    message: "메일 전송에 실패했습니다.",
  },

  // blood err
  BLOOD_NOT_FOUND: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "BLOOD4001",
    message: "해당 지정헌현글을 찾을 수 없습니다.",
  },
  BLOOD_ALREADY_LIKED: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "BLOOD4002",
    message: "이미 좋아요를 눌렀습니다.",
  },
  BLOOD_NOT_LIKED: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "BLOOD4003",
    message: "좋아요를 누르지 않았습니다.",
  },
  BLOOD_NOT_WRITER: {
    status: StatusCodes.UNAUTHORIZED,
    isSuccess: false,
    code: "BLOOD4004",
    message: "작성자만 수정할 수 있습니다.",
  },
  BLOOD_NOT_PREMIUM: {
    status: StatusCodes.UNAUTHORIZED,
    isSuccess: false,
    code: "BLOOD4005",
    message: "프리미엄 구독자만 지정헌혈 요청 글을 작성할 수 있습니다.",
  },

  // history err
  HISTORY_NOT_FOUND: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "HISTORY4001",
    message: "해당 헌혈 정보를 찾을 수 없습니다.",
  },
  IMAGE_NOT_READ: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "HISTORY4002",
    message: "해당 이미지 인식에 실패했습니다."
  },

  // crew err
  CREW_ALREADY_JOIN: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "CREW4001",
    message: "이미 크루에 가입했습니다.",
  },
  CREW_NAME_ALREADY_EXIST: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "CREW4002",
    message: "크루 이름이 이미 존재합니다.",
  },
  CREW_NOT_FOUND: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "CREW4003",
    message: "해당 크루 정보를 찾을 수 없습니다.",
  },
  CREW_NOT_JOIN: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "CREW4004",
    message: "가입된 크루가 없습니다.",
  },
  CREW_NOT_KEYWORD: {
    status: StatusCodes.BAD_REQUEST,
    isSuccess: false,
    code: "CREW4005",
    message: "검색어를 입력해주세요.",
  },
};
