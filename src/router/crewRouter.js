import express from "express";
import {
    createCrew,
    checkName,
    getAllCrew,
    getCrew,
    joinCrew,
    getMyCrew,
    getRankCrew,
    findCrew,
    withdrawCrew,
} from "../controller/crewController.js";
import {
    postChatRoom
} from "../controller/chatRoomController.js";
import {
    authenticateUser
} from "../middleware/authMiddleware.js";

export const crewRouter = express.Router();

crewRouter.post("", authenticateUser, createCrew); // 크루 생성 (크루 리더)
crewRouter.post("/check-name", authenticateUser, checkName); // 크루 이름 중복 확인
crewRouter.get("", authenticateUser, getAllCrew); // 크루 전체 조회 (9개씩 페이징)
crewRouter.get("/detail/:crewId", authenticateUser, getCrew); // 크루 상세 조회
crewRouter.post("/:crewId", authenticateUser, joinCrew); // 크루 가입 (크루 멤버)
crewRouter.get("/mycrew", authenticateUser, getMyCrew); // 나의 크루 조회
crewRouter.get("/rank", authenticateUser, getRankCrew); // 헌혈 크루 순위 조회 (6개씩 페이징)
crewRouter.get("/search", authenticateUser, findCrew); // 크루 검색
crewRouter.patch("/:crewId", authenticateUser, withdrawCrew); // 크루 탈퇴