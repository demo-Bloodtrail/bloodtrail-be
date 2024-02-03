import express from "express";
import {
  registUser,
  login,
  getUserInfo,
  regenerateToken,
  logout,
  withdrawUser,
  updateUserInfo,
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
