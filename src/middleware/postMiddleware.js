import { errResponse } from "../config/response.js";
import { status } from "../config/responseStatus.js";

export const checkPostList = async (req, res, next) => {
    // page확인, types확인
}

export const checkNewPost = async (req, res, next) => {
    const newPost = req.body;

    if (!newPost.title) {
        return res.send(errResponse(status.BAD_REQUEST));
    }

    if (!newPost.types) {
        return res.send(errResponse(status.BAD_REQUEST));
    }

    if (!newPost.content) {
        return res.send(errResponse(status.BAD_REQUEST));
    }
    next();
}