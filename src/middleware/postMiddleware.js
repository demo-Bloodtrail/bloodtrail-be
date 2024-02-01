import { getLinePosting, getGalleryPosting, postNewPost } from "../controller/postController.js";
import { status } from "../config/responseStatus.js";
import { response, errResponse, customErrResponse } from "../config/response.js";
import User from '../schema/user.js';

const POSTTYPE = ['FREE', 'HONOR', 'CERTIFY', 'INFO'];
const SORTTYPE = ['created_at', 'likes'];

export const checkPosting = async (req, res, next) => {
    try {
        const pagetype = req.query.pagetype;

        if (!POSTTYPE.includes(req.query.posttype)) {
            const error = customErrResponse(
            status.BAD_REQUEST, "페이징방식이 유효하지 않습니다.");
            return next(res.send(error));
        }
        if (!SORTTYPE.includes(req.query.sorttype)) {
            const error = customErrResponse(
            status.BAD_REQUEST, "정렬방식이 유효하지 않습니다.");
            return next(res.send(error));
        }

        if (pagetype === 'line') await getLinePosting(req, res, next);
        else if (pagetype === 'gallery') await getGalleryPosting(req, res, next);
        else throw error;
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const checkPost = async (req, res, next) => {
    try {
        const newPost = req.body;
        const { _id, email } = req.user;

        if (!newPost.title) {
            const error = customErrResponse(status.BAD_REQUEST, "제목을 작성해주세요.");
            return next(res.send(error));
        }

        if (!newPost.types) {
            const error = customErrResponse(status.BAD_REQUEST, "작성할 게시판을 선택해주세요.");
            return next(res.send(error));
        }

        if (!POSTTYPE.includes(newPost.types)) {
            const error = customErrResponse(status.BAD_REQUEST, "올바른 게시판을 선택해주세요.");
            return next(res.send(error));
        }

        if (!newPost.content) {
            const error = customErrResponse(status.BAD_REQUEST, "제목을 작성해주세요.");
            return next(res.send(error));
        }

        const user = await User.findById(_id);
        if (newPost.types === 'HONOR' && user.premium === false) {
            const error = customErrResponse(status.BAD_REQUEST, "명예 사용자가 아닙니다.");
            return next(res.send(error));
        }
        postNewPost(req, res, next);
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}