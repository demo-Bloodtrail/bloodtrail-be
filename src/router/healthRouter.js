import express from "express";
import { healthCheck } from "../controller/healthController.js";

export const healthRouter = express.Router();

healthRouter.get("", healthCheck);
