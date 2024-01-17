import { uploadOne } from "../middleware/imageMiddleware.js";
import { status } from "../config/responseStatus.js";
import {
  response,
  errResponse,
  customErrResponse,
} from "../config/response.js";
import { deleteImage } from "../middleware/imageMiddleware.js";

/*
 * API No. 1
 * API Name : S3 이미지 업로드 API (이미지 한 개 업로드)
 * [POST] /s3
 */
export const imageUpload = async (req, res, next) => {
  // 업로드 된 파일 정보는 req.file에 저장되어 있음

  const fileUrl =
    req.file && req.file.location
      ? req.file.location
      : "파일을 업로드하지 않았습니다."; // S3에 업로드 된 이미지 URL
  return res.send(response(status.SUCCESS, { fileUrl }));
};

/*
 * API No. 2
 * API Name : S3 이미지 업로드 API (이미지 여러 개 업로드)
 * [POST] /s3/several
 */
export const imagesUpload = async (req, res, next) => {
  const uploadedFiles = req.files;

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.send(
      customErrResponse(status.BAD_REQUEST, "파일을 업로드하지 않았습니다.")
    );
  }

  // S3에 업로드된 이미지 URL
  const fileUrls = uploadedFiles.map((file) => file.location);
  return res.send(response(status.SUCCESS, { fileUrls }));
};

/*
 * API No. 2
 * API Name : S3 이미지 삭제 API
 * [PATCH] /s3
 */
export const imageDelete = async (req, res, next) => {
  const { fileKey } = req.body;

  try {
    await deleteImage(fileKey);
    return res.send(response(status.SUCCESS, "이미지 삭제에 성공했습니다."));
  } catch (error) {
    return res.send(error);
  }
};
