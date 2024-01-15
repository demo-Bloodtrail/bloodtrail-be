import dotenv from "dotenv";
import request from "supertest";
import express from "express";
import { healthRouter } from "./src/router/healthRouter.js"; // 경로를 실제 프로젝트 구조에 맞게 수정

dotenv.config();

const app = express();
app.use("/health", healthRouter);

describe("Health Check API", () => {
  it('should respond with "HELLO, I\'m Healthy!"', async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.text).toBe("HELLO, I'm Healthy!");
  });
});
