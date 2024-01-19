import dotenv from "dotenv";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import uuid from "uuid4";
import { status } from "../config/responseStatus.js";
import { response, customErrResponse } from "../config/response.js";

dotenv.config();

const S3_BUCKET = process.env.S3_BUCKET;

// AWS 모듈을 사용하기 위해 AWS 계정 정보를 설정
AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

// S3 객체를 생성하여 S3와 연결
const s3 = new AWS.S3();

// AWS S3 업로드 설정
const storage = multerS3({
  s3, // AWS S3 연결
  bucket: S3_BUCKET, // S3 버킷 이름
  acl: "public-read-write", // S3 버킷 객체에 대한 권한
  contentType: multerS3.AUTO_CONTENT_TYPE, // 파일 MIME 타입 자동 지정
  key: (req, file, cb) => {
    // 파일 이름 생성 및 반환
    cb(null, Date.now().toString() + uuid() + file.originalname);
  },
});

/*******************************************************************/

// Case1. 파일 한 개만 업로드 하는 경우
export const uploadOne = multer({
  storage, // 파일 스토리지 설정
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한
  defaultValue: { path: "", mimetype: "" }, // 기본값
});

// Case2. 파일 여러개를 업로드 하는 경우
export const uploadSome = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (최대 10MB)
}).array("files", 10); // 여러 파일 업로드를 지원

// Case 3. S3에서 이미지 삭제
export const deleteImage = async (fileKey) => {
  const urlParts = fileKey.split("/");
  const fileName = urlParts[urlParts.length - 1];

  return new Promise((resolve, reject) => {
    if (!fileName) {
      const error = customErrResponse(
        status.BAD_REQUEST,
        "fileKey가 제공되지 않았습니다."
      );

      reject(error);
    }

    s3.deleteObject(
      {
        Bucket: S3_BUCKET, // S3 Bucket의 이름
        Key: fileName, // 삭제할 파일의 키 (경로 및 파일 이름)
      },
      (err, data) => {
        if (err) {
          const error = customErrResponse(
            status.INTERNAL_SERVER_ERROR,
            "이미지 삭제에 실패했습니다."
          );
          reject(error);
        } else {
          console.log("Image Deleted");
          resolve();
        }
      }
    );
  });
};
