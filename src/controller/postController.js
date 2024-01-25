import Post from '../schema/post.js';
import User from '../schema/user.js';
import { getPostComments } from './commentController.js';
import { status } from '../config/responseStatus.js';
import {
    response,
    errResponse,
} from '../config/response.js';

/*
줄글 형식의 게시판 조회 API
hot : 3, normal : 7

갤러리 형식의 게시판 조회
hot : 3, normal : 6
*/

// /post/free
export const getFreePosts = async (req, res, next) => {
    const page = req.query.page || 1; // 게시글 페이지를 이용하여 페이징
    const perPage = 7; // best 게시글을 제외한 최신 게시글은 7개를 기본 단위로 사용

    try {
        const post = await Post.find({ types: 'FREE' }, { // 최신순으로 정렬된 게시글 7개를 가져온다.
            writer: true, title: true, likes: true, watch_count: true, created_at: true })
        .sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage); 

        const bestPost = await Post.find({ types: 'FREE', likes: { $gte: 10 } }, { // 베스트 게시글 상위 3개를 가져온다.
            writer: true, title: true, likes: true, watch_count: true, created_at: true })
        .sort({ likes: -1 }).limit(3);

        const Page = [bestPost, post];
        return res.json(response(status.SUCCESS, Page));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// post/honor
export const getHonorPosts = async (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = 7;

    try {
        const post = await Post.find({ types: 'HONOR' }, { 
            writer: true, title: true, likes: true, watch_count: true, created_at: true })
        .sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage);

        const bestPost = await Post.find({ types: 'HONOR', likes: { $gte: 10 } } , { writer: true, title: true, likes: true,
        watch_count: true, created_at: true }).sort({ likes: -1 }).limit(3) // 명예게시판의 베스트 게시글 3개 가져오기

        const Page = [bestPost, post];
        return res.json(response(status.SUCCESS, Page));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// post/certify
export const getCertifyPosts = async (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = 7;

    try {
        const post = await Post.find({ types: 'CERTIFY' }, { writer: true, title: true, likes: true, 
        watch_count: true, created_at: true } )
        .sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage);

        const bestPost = await Post.find({ types: 'CERTIFY', likes: { $gte: 10 } } , { writer: true, title: true, likes: true,
        watch_count: true, created_at: true } ).sort({ likes: -1 }).limit(3); // 헌혈인증게시판의 베스트 게시글 3개 가져오기

        const Page = [bestPost, post];
        return res.json(response(status.SUCCESS, Page));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// post/info
export const getInfoPosts = async (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = 7;

    try {
        const post = await Post.find({ types: 'INFO' }, { writer: true, title: true, likes: true, 
        watch_count: true, created_at: true } )
        .sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage);

        const bestPost = await Post.find({ types: 'INFO', likes: { $gte: 10 } } , { writer: true, title: true, likes: true,
        watch_count: true, created_at: true } ).sort({ likes: -1 }).limit(3); // 헌혈인증게시판의 베스트 게시글 3개 가져오기

        const Page = [bestPost, post];
        return res.json(response(status.SUCCESS, Page));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

export const getFreePostGallery = async (req, res, next) => {
    const page = req.params.page || 1;
    const perPage = 6;
    try {
        const post = await Post.find({ types: 'FREE' }, { writer: true, title: true, image: true, content: true, created_at: true })
        .sort({ created_at: -1 }) // 최신순 정렬해서 보여주기
        .skip((page - 1) * perPage)
        .limit(perPage);

        const bestPost = await Post.find({ types: 'FREE', likes: { $gte: 10 } } , { writer: true, title: true, image: true, content: true, created_at: true })
        .sort({ likes: -1 }).limit(3); // 헌혈인증게시판의 베스트 게시글 3개 가져오기

        const Page = [bestPost, post];
        return res.json(response(status.SUCCESS, Page));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const getHonorPostGallery = async (req, res, next) => {
    const page = req.params.page || 1;
    const perPage = 6;
    try {
        const post = await Post.find({ types: 'HONOR' }, { writer: true, title: true, image: true, content: true, created_at: true })
        .sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage);

        const bestPost = await Post.find({ types: 'HONOR', likes: { $gte: 10 } } , { writer: true, title: true, image: true, content: true, created_at: true })
        .sort({ likes: -1 }).limit(3); // 헌혈인증게시판의 베스트 게시글 3개 가져오기

        const Page = [bestPost, post];
        return res.json(response(status.SUCCESS, Page));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const getCertifyPostGallery = async (req, res, next) => {
    const page = req.params.page || 1;
    const perPage = 6;
    try {
        const post = await Post.find({ types: 'CERTIFY' }, { writer: true, title: true, image: true, content: true, created_at: true })
        .sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage);

        const bestPost = await Post.find({ types: 'CERTIFY', likes: { $gte: 10 } } , { writer: true, title: true, image: true, content: true, created_at: true })
        .sort({ likes: -1 }).limit(3); // 헌혈인증게시판의 베스트 게시글 3개 가져오기

        const Page = [bestPost, post];
        return res.json(response(status.SUCCESS, Page));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const getInfoPostGallery = async (req, res, next) => {
    const page = req.params.page || 1;
    const perPage = 6;
    try {
        const post = await Post.find({ types: 'INFO' }, { writer: true, title: true, image: true, content: true, created_at: true })
        .sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage);

        const bestPost = await Post.find({ types: 'INFO', likes: { $gte: 10 } } , { writer: true, title: true, image: true, content: true, created_at: true })
        .sort({ likes: -1 }).limit(3); // 헌혈인증게시판의 베스트 게시글 3개 가져오기

        const Page = [bestPost, post];
        return res.json(response(status.SUCCESS, Page));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

// /post/:id
export const viewPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findOneAndUpdate({ _id: id }, { $inc: { watch_count: +1 } }, { new: true });
        const commentsList = await getPostComments(req, res, next);
        return res.json(response(status.SUCCESS, [post, commentsList]));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// /post/{id}/
export const deletePost = async(req, res, next) => {
    try {
        const postId = req.params.id;
        const user = req.body.userId;

        const post = await Post.findById({ _id: postId })
        // 사용자가 일치한 경우에만 삭제 가능
        if (post.writer.id != user) {
            return res.status(400).json(errResponse(status.BAD_REQUEST));
        }

        await Post.findByIdAndDelete({ _id: postId });
    
        return res.json(response(status.SUCCESS));
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// /post/newpost
export const postNewPost = async (req, res, next) => {
    try {
        const { writerId, title, content, image, types } = req.body;
        const writer = await User.findById(writerId);

        const newPost = new Post({
            writer: {
                id: writerId,
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
        res.send(newPost);
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};