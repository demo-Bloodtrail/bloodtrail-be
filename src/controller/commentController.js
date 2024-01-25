import Comment from '../schema/comment.js';
import Post from '../schema/post.js';
import User from '../schema/user.js';
import { status } from '../config/responseStatus.js';
import {
    response,
    errResponse,
} from '../config/response.js';

// /post/:id/comment
export const postComment = async (req, res, next) => {
    try {
        console.log("postComment controller");
        const { postId, commenterId, comment } = req.body;
        console.log(`${postId}   ${commenterId}   ${comment}`);
        const commenter = await User.findById(commenterId);
        const newComment = new Comment({
            post: postId,
            commenter: {
                id: commenterId,
                nickname: commenter.nickname
            },
            comment,
            created_at: Date.now()
        });

        await newComment.save();
        console.log(newComment);
        res.send(newComment);
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// /post/:id/like
export const patchLike = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findOneAndUpdate({ _id: id }, { $inc: { likes: +1 } }, { new: true });
        return res.json(response(status.SUCCESS, post));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// /post/{id}/amend
export const amendPost = async(req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, content, image, types } = req.body;
        const post = await Post.findOneAndUpdate({ _id: postId }, { 
            title: title, 
            content: content, 
            image: image,
            types: types,
            updated_at: Date.now()
        });
        return res.json(response(status.SUCCESS, post));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const getPostComments = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const CommentsList = await Comment.find({ post: postId }, { commenter: true, comment: true, created_at: true })
        .sort({ created_at: -1 });
        return CommentsList;
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}