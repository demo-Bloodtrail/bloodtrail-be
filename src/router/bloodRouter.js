import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  postBlood,
  patchBlood,
  getAllBloods,
  getBlood,
  likeBlood,
  undoLikeBlood,
} from "../controller/bloodController.js";
import { uploadSome } from "../middleware/imageMiddleware.js";

export const bloodRouter = express.Router();

bloodRouter.post("", authenticateUser, uploadSome, postBlood); // 지정헌혈글 저장
bloodRouter.patch("/:bloodId", authenticateUser, uploadSome, patchBlood); // 지정헌혈글 수정
bloodRouter.get("/:page/all", authenticateUser, getAllBloods); // 지정헌혈글 전체 조회
bloodRouter.get("/:bloodId", authenticateUser, getBlood); // 지정헌혈글 상세 조회
bloodRouter.post("/:bloodId/like", authenticateUser, likeBlood); // 지정헌혈글 좋아요
bloodRouter.patch("/:bloodId/like", authenticateUser, undoLikeBlood); // 지정헌혈글 좋아요 취소
