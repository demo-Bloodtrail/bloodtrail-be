import express from "express";
import {
    createNotice,
    getAllNotice,
} from "../controller/noticeController.js";
import {
    authenticateUser
} from "../middleware/authMiddleware.js";

export const noticeRouter = express.Router();

noticeRouter.post("", authenticateUser, createNotice); // 알림 생성
noticeRouter.get("", authenticateUser, getAllNotice); // 알림 조회