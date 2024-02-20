import express from "express";
import {
  registUser,
  login,
  getUserInfo,
  regenerateToken,
  logout,
  withdrawUser,
  updateUserInfo,
  checkEmail,
  findPassword,
  subscribePremium,
  getRank,
} from "../controller/authController";
import {
  authenticateUser,
  authenticateWithRefresh,
} from "../middleware/authMiddleware.js";
import { uploadOne } from "../middleware/imageMiddleware.js";

export const authRouter = express.Router();

authRouter.post("/register", uploadOne.single("file"), registUser);
authRouter.post("/login", login);
authRouter.post("/regenerate-token", authenticateWithRefresh, regenerateToken);
authRouter.post("/logout", authenticateUser, logout);
authRouter.patch("/withdraw", authenticateUser, withdrawUser);
authRouter.get("/profile", authenticateUser, getUserInfo);
authRouter.patch(
  "/update",
  authenticateUser,
  uploadOne.single("file"),
  updateUserInfo
);
authRouter.post("/check-email", checkEmail); // 이메일 인증
authRouter.patch("/find-password", findPassword); // 비밀번호 찾기
authRouter.post("/premium", authenticateUser, subscribePremium); // 프리미엄 구독
authRouter.get("/payment", function (req, res) {
  res.render("payment");
});
authRouter.get("/rank", getRank); // 헌혈 랭킹 조회