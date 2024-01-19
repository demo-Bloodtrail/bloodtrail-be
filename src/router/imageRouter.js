import express from "express";
import multer from "multer";
import {
  imageUpload,
  imagesUpload,
  imageDelete,
} from "../controller/imageController.js";
import {
  uploadOne,
  uploadSome,
  deleteImage,
} from "../middleware/imageMiddleware.js";

export const imageRouter = express.Router();

imageRouter.post("", uploadOne.single("file"), imageUpload);
imageRouter.post("/several", uploadSome, imagesUpload);
imageRouter.patch("", imageDelete);
