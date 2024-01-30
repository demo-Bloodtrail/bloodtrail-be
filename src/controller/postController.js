import Post from '../schema/post.js';
import User from '../schema/user.js';
import { status } from "../config/responseStatus.js";
import { errResponse, response } from '../config/response.js';
import { getPostComments } from '../controller/commentController.js';


// 줄글 형식으로 글들을 가져오기
// status 확인 필요
export const getLinePosting = async (req, res, next) => {
    const page = req.query.page || 1; // 게시글 페이지를 이용하여 페이징
    const perPage = 7; // best 게시글을 제외한 최신 게시글은 7개를 기본 단위로 사용

    try {
        const posttype = req.query.posttype;
        const sorttype = req.query.sorttype; // [created_at, likes]

        const bestPost = await Post.find({ types: posttype, likes: { $gte: 10 }, status: true }, {
            writer: true, title: true, likes: true, watch_count: true, created_at: true })
        .sort({ likes: -1 }).limit(3);

        if (sorttype === 'created_at') { // 최신순 정렬
            const post = await Post.find({ types: posttype, status: true }, {
                writer: true, title: true, likes: true, watch_count: true, created_at: true
            }).sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage); // sorttype 
            const Page = [bestPost, post];
            return res.send(response(status.SUCCESS, Page));
        }
        else { // 공감순 정렬
            const post = await Post.find({ types: posttype, status: true }, {
                writer: true, title: true, likes: true, watch_count: true, created_at: true
            }).sort({ likes: -1 }).skip((page - 1) * perPage).limit(perPage); // sorttype 
            const Page = [bestPost, post];
            return res.send(response(status.SUCCESS, Page));
        }
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

// 갤러리 형식으로 글들을 가져오기
// status 확인필요
export const getGalleryPosting = async (req, res, next) => {
    const page = req.query.page || 1; // 게시글 페이지를 이용하여 페이징
    const perPage = 6; // best 게시글을 제외한 최신 게시글은 6개를 기본 단위로 사용

    try {
        const posttype = req.query.posttype;
        const sorttype = req.query.sorttype; // [created_at, likes]

        const bestPost = await Post.find({ types: posttype, likes: { $gte: 10 }, status: true }, {
            writer: true, title: true, likes: true, watch_count: true, created_at: true })
        .sort({ likes: -1 }).limit(3);

        if (sorttype === 'created_at') {
            const post = await Post.find({ types: posttype, status: true }, {
                writer: true, title: true, likes: true, watch_count: true, created_at: true
            }).sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage); // sorttype 
            const Page = [bestPost, post];
            return res.send(response(status.SUCCESS, Page));
        }
        else {
            const post = await Post.find({ types: posttype, status: true }, {
                writer: true, title: true, likes: true, watch_count: true, created_at: true
            }).sort({ likes: -1 }).skip((page - 1) * perPage).limit(perPage); // sorttype 
            const Page = [bestPost, post];
            return res.send(response(status.SUCCESS, Page));
        }
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

// 게시글의 주변 게시글 가져오기
export const viewPost = async (req, res, next) => {
    try {
        const { _id, email } = req.user;
        const postId = req.params.id;

        const post = await Post.findOneAndUpdate({ _id: postId }, { $inc: { watch_count: +1 } }, { new: true });

        const commentList = await getPostComments(req, res, next); // 댓글 가져오기

        // 추천 게시글 가져오기


        return res.send(response(status.SUCCESS, [post, commentList]));
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// 포스팅 삭제하기
export const deletePost = async(req, res, next) => {
    try {
        const { _id, email } = req.user;
        const postId = req.params.id;

        const post = await Post.findById({ _id: postId });
        const writerId = post.writer.id;

        if (String(writerId) !== _id) { 
            return res.send(errResponse(status.BAD_REQUEST));
        }

        await Post.findByIdAndDelete({ _id: postId });
        res.send(response(status.SUCCESS));
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// 포스팅 게시하기
// 명예 게시판이 사용가능한 명예회원인지 확인하고 글을 작성할 수 있도록 한다.
export const postNewPost = async (req, res, next) => {
    try {
        const { title, content, image, types } = req.body;
        const { _id, email } = req.user;
        const writer = await User.findById(_id);
        const newPost = new Post({
            writer: {
                id: _id,
                nickname: writer.nickname,
            },
            title,
            content,
            image,
            types,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
        await newPost.save();
        res.send(response(status.SUCCESS));
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

export const checkUserAmend = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { _id, email } = req.user;

        const post = await Post.findById({ _id: postId });

        if (String(post.writer.id) === _id) {
            amendPost(req, res, next);
        }
        else {
            console.log("수정이 불가능한 사용자입니다.");
            return res.send(errResponse(status.BAD_REQUEST));
        }

    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

// /post/{id}/amend
export const amendPost = async(req, res, next) => {
    try {
        const postId = req.params.id;
        const { _id, email } = req.user;
        const { title, content, image, types } = req.body;

        const post = await Post.findOneAndUpdate({ _id: postId }, { 
            title: title, 
            content: content, 
            image: image,
            types: types,
            updated_at: Date.now()
        });
        return res.send(response(status.SUCCESS));
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}