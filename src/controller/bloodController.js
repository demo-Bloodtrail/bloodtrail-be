import { status } from "../config/responseStatus.js";
import {
  response,
  errResponse,
  customErrResponse,
} from "../config/response.js";
import Blood from "../schema/blood.js";
import User from "../schema/user.js";
import { deleteImage } from "../middleware/imageMiddleware.js";

/*
 * API No. 1
 * API Name : 지정헌혈글 작성 API
 * [POST] /blood
 */
export const postBlood = async (req, res, next) => {
  try {
    const { _id, email } = req.user;

    // 프리미엄 구독하고 있는지 검사 (프리미엄 구독자만 지정헌혈 요청 글 작성 가능)
    const user = await User.findById(_id);
    if (user.premium.payment == false) {
      return res.send(errResponse(status.BLOOD_NOT_PREMIUM));
    }

    const {
      title,
      content,
      blood_type,
      blood_product,
      start_date,
      end_date,
      receiver,
      hospital,
    } = req.body;
    const uploadedFiles = req.files;

    // 유효성 검사 -> 프론트에서 검사 후에 넘겨달라고 요청
    if (
      !title ||
      !blood_type ||
      !blood_product ||
      !start_date ||
      !end_date ||
      !receiver ||
      !hospital
    ) {
      return res.send(
        customErrResponse(status.BAD_REQUEST, "모든 필드를 입력해주세요.")
      );
    }

    let fileUrls;
    if (uploadedFiles && uploadedFiles.length != 0) {
      fileUrls = uploadedFiles.map((file) => file.location); // S3에 업로드된 이미지 URL
    }

    const newBlood = new Blood({
      writer: _id,
      title,
      content,
      image: fileUrls || [],
      blood_type,
      blood_product,
      start_date,
      end_date,
      receiver,
      hospital: {
        name: JSON.parse(hospital).name,
        number: JSON.parse(hospital).number,
      },
    });

    const savedBlood = await newBlood.save();
    return res.send(response(status.SUCCESS, savedBlood));
  } catch (err) {
    console.error(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 2
 * API Name : 지정헌혈글 수정 API (S3 업로드 삭제 후 글 수정)
 * [PATCH] /blood/:bloodId
 */
export const patchBlood = async (req, res, next) => {
  console.log("지정헌혈글 수정 API 요청");
  const { _id, email } = req.user;
  const bloodId = req.params.bloodId;
  const {
    title,
    content,
    blood_type,
    blood_product,
    start_date,
    end_date,
    receiver,
    hospital,
  } = req.body;
  const uploadedFiles = req.files;

  const blood = await Blood.findById(bloodId);

  // 해당 글 작성자만 수정 가능
  if (blood.writer != _id) {
    return res.send(errResponse(status.BLOOD_NOT_WRITER));
  }

  // 1. S3 업로드 된 이미지 삭제
  const fileKeys = blood.image;

  try {
    for (const fileKey of fileKeys) {
      await deleteImage(fileKey);
    }
    console.log("이미지 삭제 성공");
  } catch (err) {
    return res.send(err);
  }

  // 2. S3 이미지 업로드
  let fileUrls;
  if (uploadedFiles && uploadedFiles.length != 0) {
    fileUrls = uploadedFiles.map((file) => file.location); // S3에 업로드된 이미지 URL
  }

  // 3. 게시글 수정
  try {
    const updatedBlood = await Blood.findOneAndUpdate(
      { _id: bloodId },
      {
        title,
        content,
        image: fileUrls || [],
        blood_type,
        blood_product,
        start_date,
        end_date,
        receiver,
        hospital: {
          name: JSON.parse(hospital).name,
          number: JSON.parse(hospital).number,
        },
      },
      {
        new: true,
      }
    );

    return res.send(response(status.SUCCESS, updatedBlood));
  } catch (err) {
    console.error(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 3
 * API Name : 지정헌혈글 전체 조회 API (9개씩 페이징 처리)
 * [GET] /blood/:page/all?type=type&product=product&filter=filter
 */
export const getAllBloods = async (req, res, next) => {
  console.log("지정헌혈글 전체 조회 API 요청");
  const { type, product, filter } = req.query;
  const page = req.params.page || 1;

  try {
    const query = {}; // 쿼리 조건 초기화

    // 필터링 조건 1 : 혈액형
    if (type) {
      const type_array = ["A+", "AB+", "B+", "O+", "A-", "AB-", "B-", "O-"];
      console.log("혈액형: " + type_array[parseInt(type)]);
      query.blood_type = type_array[parseInt(type)];
    }

    // 필터링 조건 2 : 필요혈액제제 (없는 경우 전체)
    if (product) {
      query.blood_product = product;
    }

    // 필터링 조건 3 : 신규순 / 공감순 / 마감일자순
    let sortOption = {};
    if (filter == "latest") {
      // 신규순
      sortOption = { created_at: -1 };
    } else if (filter == "likes") {
      // 공감순
      sortOption = { likeCount: -1 };
    } else if (filter == "deadline") {
      // 마감일자순
      // 1. end_date로 내림차순 + 현재 시간보다 end_date가 작은 것만 추출
      // sortOption = {
      //   end_date: -1, // 1. end_date로
      //   $or: [{ end_date: { $lt: Date.now } }, { end_date: null }],
      // };

      sortOption = { end_date: { $gt: Date.now() }, end_date: 1 };
    }

    // 페이징 처리를 위한 옵션 설정
    const options = {
      skip: (parseInt(page) - 1) * 9,
      limit: 9,
      sort: sortOption,
    };

    const bloodList = await Blood.find(query, null, options).populate({
      path: "writer",
      select: ["nickname", "profile_image"],
    });

    const result = {
      bloodList: bloodList,
      currentPage: parseInt(page),
      totalPages: Math.ceil(bloodList.length / 9),
    };

    return res.send(response(status.SUCCESS, result));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 4
 * API Name : 지정헌혈글 상세 조회 API
 * [GET] /blood/:bloodId
 * TO DO : 반환값에 채팅 주소 추가
 */
export const getBlood = async (req, res, next) => {
  const bloodId = req.params.bloodId;
  const { _id, email } = req.user;

  try {
    const blood = await Blood.findOneAndUpdate(
      { _id: bloodId },
      { $inc: { views: 1 } }, // 조회수 1 증가
      { new: true } // 업데이트 후의 blood를 반환하도록 설정
    ).populate({
      path: "writer",
      select: ["nickname", "profile_image"],
    });

    if (!blood) {
      return res.send(errResponse(status.BLOOD_NOT_FOUND));
    }

    // 좋아요 눌렀는지 여부 검사
    const alreadyLiked = blood.likes.some((_id) => _id.equals(_id));
    return res.send(response(status.SUCCESS, { blood, isLiked: alreadyLiked }));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 5
 * API Name : 지정헌혈글 좋아요 API
 * [POST] /blood/:bloodId/like
 */
export const likeBlood = async (req, res, next) => {
  const { _id, email } = req.user;
  const bloodId = req.params.bloodId;

  try {
    const blood = await Blood.findOneAndUpdate(
      {
        _id: bloodId,
        likes: { $ne: _id }, // 좋아요 누르지 않은 경우에만 업데이트
      },
      {
        $push: { likes: _id }, // likes에 현재 사용자의 _id 추가
        $inc: { likeCount: 1 }, // 좋아요 개수 1 증가
      },
      { new: true } // 업데이트 된 문서 반환
    );

    if (!blood) {
      return res.send(errResponse(status.BLOOD_ALREADY_LIKED));
    }

    return res.send(response(status.SUCCESS, "지정헌혈글 좋아요 성공"));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 6
 * API Name : 지정헌혈글 좋아요 취소 API
 * [PATCH] /blood/:bloodId/like
 */
export const undoLikeBlood = async (req, res, next) => {
  const { _id, email } = req.user;
  const bloodId = req.params.bloodId;

  try {
    const blood = await Blood.findOneAndUpdate(
      {
        _id: bloodId,
        likes: _id, // 좋아요 누른 경우에만 업데이트
      },
      {
        $pull: { likes: _id }, // likes에 현재 사용자의 _id 제거
        $inc: { likeCount: -1 }, // 좋아요 개수 1 감소
      },
      { new: true } // 업데이트 된 문서 반환
    );

    if (!blood) {
      return res.send(errResponse(status.BLOOD_NOT_LIKED));
    }

    return res.send(response(status.SUCCESS, "지정헌혈글 좋아요 취소 성공"));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};
