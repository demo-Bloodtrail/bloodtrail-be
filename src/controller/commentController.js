import Comment from '../schema/comment.js';
import Post from '../schema/post.js';
import User from '../schema/user.js';
import { status } from "../config/responseStatus.js";
import { response, errResponse, customErrResponse } from "../config/response.js";

// 댓글 작성하기
export const postComment = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const comment = req.body.comment; 
        const { _id, email } = req.user; // body에서 가져오지 않고 댓글 내용과 작성자 저장하기
        const commenter = await User.findById(_id);

        if (comment == "") {
            const error = customErrResponse(status.BAD_REQUEST, "댓글을 작성해주세요.");
            return next(res.send(error));
        }

        const newComment = new Comment({
            post: postId,
            commenter: {
                id: _id,
                nickname: commenter.nickname
            },
            comment,
        });

        await newComment.save();
        return res.send(response(status.SUCCESS, newComment));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR))
    }
};

// 좋아요 누르기
export const patchLike = async (req, res, next) => {
    try {
        const { _id, email } = req.user;
        const postid = req.params.id;
        const post = await Post.findById({ _id: postid });

        if (post.like_users.includes(_id)) { // 이미 좋아요를 누른 사람인 경우
            const error = customErrResponse(status.BLOOD_ALREADY_LIKED, "이미 좋아요를 눌렀습니다.");
            return next(res.send(error));
        }

        post.like_users.push(_id); // 좋아요 목록에 추가
        post.likes += 1;
        await post.save();

        return res.send(response(status.SUCCESS, "좋아요 누르기 성공"));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// 좋아요 취소하기
export const deleteLike = async (req, res, next) => {
    try {
        const { _id, email } = req.user;
        const postid = req.params.id;
        const post = await Post.findById({ _id: postid });

        if (!post.like_users.includes(_id)) { // 좋아요를 누르지 않은 사람인 경우
            const error = customErrResponse(status.BLOOD_NOT_LIKED, "좋아요를 누르지 않았습니다.");
            return next(res.send(error));
        }

        post.like_users.pop(_id);
        post.likes -= 1;
        await post.save();

        return res.send(response(status.SUCCESS, "좋아요 취소하기 성공"));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

// 게시글에 작성된 댓글 조회하기
export const viewComment = async (req, res, next) => {
    try {
        const allComments = await Comment.find({ post: req.params.id, status: true }, 
            { 'commenter.nickname': true, comment: true, created_at: true })
        .sort({ created_at: -1 });
        return res.send(response(status.SUCCESS, allComments));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}