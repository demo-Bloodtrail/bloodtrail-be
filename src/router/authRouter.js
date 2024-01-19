import express from "express";
import {
  registUser,
  login,
  regenerateToken,
  logout,
  withdrawUser,
  getUserInfo,
  updateUserInfo,
} from "../controller/authController";
import {
  authenticateUser,
  authenticateWithRefresh,
} from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

authRouter.post("/register", registUser);
authRouter.post("/login", login);
authRouter.post("/regenerate-token", authenticateWithRefresh, regenerateToken);
authRouter.post("/logout", authenticateUser, logout);
authRouter.patch("/withdraw", authenticateUser, withdrawUser);
authRouter.get("/profile", authenticateUser, getUserInfo);
authRouter.patch("/update", authenticateUser, updateUserInfo);
