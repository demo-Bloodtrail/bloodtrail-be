import express from "express";
import { registUser, login } from "../controller/authController";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", registUser);
