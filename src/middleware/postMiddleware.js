import { getLinePosting, getGalleryPosting, postNewPost } from "../controller/postController.js";
import { status } from "../config/responseStatus.js";
import { response, errResponse, customErrResponse } from "../config/response.js";
import User from '../schema/user.js';

const POSTTYPE = ['FREE', 'HONOR', 'CERTIFY', 'INFO']; // 유효한 게시판
const SORTTYPE = ['created_at', 'likes']; // 유효한 정렬 방식

export const checkPosting = async (req, res, next) => {
    try {
        const pagetype = req.query.pagetype;

        if (!POSTTYPE.includes(req.query.posttype)) { // 쿼리로 넘어온 게시판이 유효한지 확인.
            const error = customErrResponse(
            status.BAD_REQUEST, "게시판이 유효하지 않습니다.");
            return next(res.send(error));
        }
        if (!SORTTYPE.includes(req.query.sorttype)) { // 쿼리로 넘어온 정렬방식이 유효한지 확인
            const error = customErrResponse(
            status.BAD_REQUEST, "정렬방식이 유효하지 않습니다.");
            return next(res.send(error));
        }

        if (isNaN(Number(req.query.page))) { // 쿼리로 넘어온 페이지의 인덱스가 숫자인지 확인
            const error = customErrResponse(
                status.BAD_REQUEST, "페이지 인덱스가 유효하지 않습니다.");
                return next(res.send(error));
        }

        if (pagetype === 'line') await getLinePosting(req, res, next); // 페이징 방식이 줄글 형식인 경우
        else if (pagetype === 'gallery') await getGalleryPosting(req, res, next); // 페이징 방식이 갤러리 형식인 경우
        else {
            const error = customErrResponse(
                status.BAD_REQUEST, "페이징방식이 유효하지 않습니다.");
                return next(res.send(error));
        }
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const checkPost = async (req, res, next) => {
    try {
        const newPost = req.body; 
        const { _id, email } = req.user;

        if (!newPost.title) { // 제목 누락 검사
            const error = customErrResponse(status.BAD_REQUEST, "제목을 작성해주세요.");
            return next(res.send(error));
        }

        if (!newPost.types) { // 게시판 누락 검사
            const error = customErrResponse(status.BAD_REQUEST, "작성할 게시판을 선택해주세요.");
            return next(res.send(error));
        }

        if (!POSTTYPE.includes(newPost.types)) { // 유효한 게시판에 작성하는지 검사
            const error = customErrResponse(status.BAD_REQUEST, "올바른 게시판을 선택해주세요.");
            return next(res.send(error));
        }

        if (!newPost.content) { // 내용 누락 검사
            const error = customErrResponse(status.BAD_REQUEST, "제목을 작성해주세요.");
            return next(res.send(error));
        }

        const user = await User.findById(_id); // 명예게시판에 작성하는 경우 사용자의 자격을 판단
        if (newPost.types === 'HONOR' && user.premium === false) {
            const error = customErrResponse(status.BAD_REQUEST, "명예 사용자가 아닙니다.");
            return next(res.send(error));
        }
        postNewPost(req, res, next);
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}