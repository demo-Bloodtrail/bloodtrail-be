import Comment from '../schema/comment.js';
import Post from '../schema/post.js';
import User from '../schema/user.js';

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
        console.error(error);
        next(error);
    }
};


export const patchLike = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findOneAndUpdate({ _id: id }, { $inc: { likes: +1 } }, { new: true });
        console.log(id);
        res.json(post);
    } catch ( error ) {
        console.error(error);
        next(error);
    }
};