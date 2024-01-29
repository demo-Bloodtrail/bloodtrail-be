import express from "express";
import {
    postHistory,
    getAllHistories,
    getHistory,
    updateHistory,
    deleteHistory,
} from "../controller/historyController.js";
import {
    authenticateUser,
} from "../middleware/authMiddleware.js";

export const historyRouter = express.Router();

historyRouter.post("", authenticateUser, postHistory); // 헌혈 증서 등록
historyRouter.get("", authenticateUser, getAllHistories); // 헌혈 정보 전체 조회
historyRouter.get("/:historyId", authenticateUser, getHistory); // 헌혈 정보 상세 조회
historyRouter.patch("/:historyId", authenticateUser, updateHistory); // 헌혈 정보 수정
historyRouter.delete("/:historyId", authenticateUser, deleteHistory); // 헌혈 정보 삭제