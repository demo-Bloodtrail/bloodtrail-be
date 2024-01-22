import express from "express";
import { specs } from "./swagger/swagger.js";
import SwaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import cors from "cors";

import { connect } from "./src/config/database.js";
import { response, errResponse } from "./src/config/response.js";
import { status } from "./src/config/responseStatus.js";
import { healthRouter } from "./src/router/healthRouter.js";
import { authRouter } from "./src/router/authRouter.js";
import { imageRouter } from "./src/router/imageRouter.js";
import { postRouter } from "./src/router/postRouter.js"; // Goosmos
import { bloodRouter } from "./src/router/bloodRouter.js";

dotenv.config(); // .env 파일 사용 (환경 변수 관리)

const app = express();
connect(); // mongodb 연결

// server setting - view, static, body-parser etc..
app.set("port", process.env.PORT || 3000); // 서버 포트 지정
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// Router
app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(specs)); // swagger
app.use("/health", healthRouter); // health check
app.use("/auth", authRouter); // auth
app.use("/s3", imageRouter); // image
app.use("/post", postRouter); // post
app.use("/blood", bloodRouter); // blood

app.get("/", (req, res, next) => {
  res.send(response(status.SUCCESS, "루트 페이지!"));
});

// error handling
app.use((req, res, next) => {
  next(res.send(errResponse(status.NOT_FOUND)));
});

app.use((err, req, res, next) => {
  // 템플릿 엔진 변수 설정
  res.locals.message = err.message;
  // 개발환경이면 에러를 출력하고 아니면 출력하지 않기
  res.locals.error = process.env.NODE_ENV !== "prod" ? err : {};
  console.error(err);
  res
    .status(err.data.status || status.INTERNAL_SERVER_ERROR)
    .send(response(err.data));
});

app.listen(app.get("port"), () => {
  console.log(`Example app listening on port ${app.get("port")}`);
  console.log(`Now env ` + process.env.NODE_ENV);
  console.log(`Now REDIS_HOST ` + process.env.REDIS_HOST);
});
