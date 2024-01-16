import express from "express";
import {
  registUser,
  login,
  getUserInfo,
  regenerateToken,
} from "../controller/authController";
import {
  authenticateUser,
  authenticateWithRefresh,
} from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", registUser);
authRouter.get("/profile", authenticateUser, getUserInfo);
authRouter.post("/regenerate-token", authenticateWithRefresh, regenerateToken);
