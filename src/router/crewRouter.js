import express from "express";
import {
    createCrew,
    checkName,
    getAllCrew,
    getCrew,
    joinCrew,
} from "../controller/crewController.js";
import {
    authenticateUser
} from "../middleware/authMiddleware.js";

export const crewRouter = express.Router();

crewRouter.post("", authenticateUser, createCrew); // 크루 생성 (크루 리더)
crewRouter.post("/check-name", authenticateUser, checkName); // 크루 이름 중복 확인
crewRouter.get("", authenticateUser, getAllCrew); // 크루 전체 조회
crewRouter.get("/:crewId", authenticateUser, getCrew); // 크루 상세 조회
crewRouter.post("/:crewId", authenticateUser, joinCrew); // 크루 가입 (크루 멤버)