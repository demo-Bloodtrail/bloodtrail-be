import Post from '../schema/post.js';
import User from '../schema/user.js';
import { status } from "../config/responseStatus.js";
import { customErrResponse, errResponse, response } from '../config/response.js';
import { deleteImage } from '../middleware/imageMiddleware.js';

const viewObj = new Object();


// 줄글 형식으로 게시글을 확인하기
export const getLinePosting = async (req, res, next) => {
    const page = req.query.page || 1; // 게시글 페이지를 이용하여 페이징
    const perPage = 7; // best 게시글을 제외한 최신 게시글은 7개를 기본 단위로 사용

    try {
        const posttype = req.query.posttype; // [FREE, HONOR, INFO, CERTIFY]
        const sorttype = req.query.sorttype; // [created_at, likes]

        const bestPost = await Post.find({ types: posttype, likes: { $gte: 10 }, status: true }, {
            writer: true, title: true, likes: true, watch_count: true, created_at: true })
        .sort({ likes: -1 }).limit(3); // 공감이 10개 이상인 게시글 중 상위 3개를 선택

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
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

// 갤러리 형식으로 글들을 가져오기
export const getGalleryPosting = async (req, res, next) => {
    const page = req.query.page || 1; // 게시글 페이지를 이용하여 페이징
    const perPage = 6; // best 게시글을 제외한 최신 게시글은 6개를 기본 단위로 사용

    try {
        const posttype = req.query.posttype; // [FREE, HONOR, INFO, CERTIFY]
        const sorttype = req.query.sorttype; // [created_at, likes]
        const bestPost = await Post.find({ types: posttype, likes: { $gte: 10 }, status: true }, {
            writer: true, title: true, image: true, content: true, created_at: true })
        .sort({ likes: -1 }).limit(3); // 공감이 10개 이상인 게시글 중 상위 3개를 선택
        
        const postCount = await Post.countDocuments({ types: posttype, status: true });
        let totalPage = Math.ceil(postCount / perPage); // 페이지 추가


        if (sorttype === 'created_at') { // 최신순 정렬
            const post = await Post.find({ types: posttype, status: true }, {
                writer: true, title: true, image: true, content: true, created_at: true
            }).sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage); // sorttype 
            const Page = [bestPost, post];
            return res.send(response(status.SUCCESS, { totalPage, Page }));
        }
        else { // 공감순 정렬
            const post = await Post.find({ types: posttype, status: true }, {
                writer: true, title: true, image: true, content: true, created_at: true
            }).sort({ likes: -1 }).skip((page - 1) * perPage).limit(perPage); // sorttype 
            const Page = [bestPost, post];
            return res.send(response(status.SUCCESS, { totalPage, Page }));
        }
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

// 게시글 상세조회와 게시글 조회수 증가, 해당 게시글에 작성된 댓글도 같이 가져오기
export const viewPost = async (req, res, next) => {
    try {
        const { _id, email } = req.user;
        const postId = req.params.id;
        // const post = await Post.findOneAndUpdate({ _id: postId }, { $inc: { watch_count: +1 } }, { new: true });
        const post = await Post.findById({ _id: postId });

        if (!viewObj[postId]) viewObj[postId] = []; // 리스트를 생성
        if (viewObj[postId].indexOf(_id) == -1) {
            viewObj[postId].push(_id);
            post.watch_count++;
            await post.save();
            setTimeout(() => {
                viewObj[postId].splice(viewObj[postId].indexOf(_id), 1)
            }, 600000);
        }

        for (let i in viewObj) {
            if (i.length == 0) delete viewObj.i;
        }


        if (post.like_users.includes(_id)) { // 이미 좋아요를 누른 사람인 경우
            let userLiked = true;
            return res.send(response(status.SUCCESS, { userLiked, post }));
        }
        else {
            let userLiked = false;
            return res.send(response(status.SUCCESS, { userLiked, post }));
        }
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// postRouter.get('/:id/', authenticateUser, viewRecommandPost);
export const viewRecommendPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const nowPost = await Post.findById({ _id: postId });
        const allPost = await Post.find({ types: nowPost.types, status: true },
            { title: true, content: true, image: true, created_at: true }).sort({ created_at: -1 });
        const currentIndex = allPost.findIndex(p => p._id.toString() === postId);
        const start = currentIndex - 7 < 0 ? 0 : currentIndex - 7;
        const end = start + 15 > allPost.length ? allPost.length : start + 15;
        const neighborPosts = allPost.slice(start, end);
        return res.send(response(status.SUCCESS, neighborPosts));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

// 포스팅 삭제하기
export const deletePost = async(req, res, next) => {
    try {
        const { _id, email } = req.user;
        const postId = req.params.id;

        const post = await Post.findById({ _id: postId });
        const writerId = post.writer.id;

        if (String(writerId) !== _id) {  // 게시글 작성자와 사용자가 동일한지 검사
            return res.send(customErrResponse(status.BAD_REQUEST, '작성자가 아닙니다.'));
        }

        await Post.findByIdAndDelete({ _id: postId });
        return res.send(response(status.SUCCESS, '게시글 삭제 성공'));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

// 포스팅 게시하기
export const postNewPost = async (req, res, next) => {
    try {
        const { title, content, types } = req.body;
        const { _id, email } = req.user;
        const writer = await User.findById(_id);
        const uploadedFiles = req.files;

        let fileUrls;
        if (uploadedFiles && uploadedFiles.length != 0) {
            fileUrls = uploadedFiles.map((file) => file.location);
        }

        const newPost = new Post({
            writer: {
                id: _id,
                nickname: writer.nickname,
            },
            title,
            content,
            image: fileUrls || [],
            types,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
        await newPost.save();
        return res.send(response(status.SUCCESS, newPost));
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

export const amendPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { _id, email } = req.user;
        const { title, content, types } = req.body;
        const uploadedFiles = req.files;

        const post = await Post.findById({ _id: postId });

        if (String(post.writer.id) !== _id) { // 게시글 작성자와 사용자가 동일한지 검사
            const error = customErrResponse(status.BAD_REQUEST, "작성자가 아닙니다.");
            return next(res.send(error));
        }
        
        const fileKeys = post.image;
        try {
            for (const fileKey of fileKeys) await deleteImage(fileKey);
        } catch ( error ) {
            return res.send(error);
        }

        let fileUrls;

        if(uploadedFiles && uploadedFiles.length != 0) {
            fileUrls = uploadedFiles.map((file) => file.location);
        }

        const updatedPost = await Post.findByIdAndUpdate({ _id: postId }, 
            { title: title, content: content, image: fileUrls || [], types: types, updated_at: Date.now() }, 
            { new: true });
        return res.send(response(status.SUCCESS, updatedPost));
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const getHomePosts = async (req, res, next) => {
    try {
        const homePost = await Post.find({ types: 'FREE', status: true}, 
        { writer: true, title: true, image: true, content: true, created_at: true }).sort({ likes: -1 }).limit(4);
        return res.send(response(status.SUCCESS, homePost));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const findPost = async (req, res, next) => {
    try {
        const findType = req.query.type;
        const keyword = req.body.keyword;
        let posts;
        if (findType === 'title') {
            posts = await Post.find({ title: { $regex: keyword, $options: 'i' } }, 
            { title: true, writer: true, created_at: true, watch_count: true, likes: true });
        }
        else{
            posts = await Post.find({ 'writer.nickname': { $regex: keyword, $options: 'i' } },
            { title: true, writer: true, created_at: true, watch_count: true, likes: true });
        }
        return res.send(response(status.SUCCESS, posts));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}