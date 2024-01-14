import express from "express";
import { registUser, login, getUserInfo } from "../controller/authController";
import { authenticateUser } from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", registUser);
authRouter.get("/profile", authenticateUser, getUserInfo);
