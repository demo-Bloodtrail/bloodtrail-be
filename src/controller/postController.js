import Post from '../schema/post.js';
import User from '../schema/user.js';

// /post/free
export const getFreePosts = async (req, res, next) => {
    const page = req.query.page || 1; // 게시글 페이지를 이용하여 페이징
    const perPage = 7; // best 게시글을 제외한 최신 게시글은 7개를 기본 단위로 사용

    try {
        const post = await Post.find({ types: 'FREE' }, { // 최신순으로 정렬된 게시글 7개를 가져온다.
            writer: true, title: true, likes: true, watch_count: true, created_at: true })
        .sort({ created_at: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage); 

        const bestPost = await Post.find({ types: 'FREE', likes: { $gte: 10 } }, { // 베스트 게시글 상위 3개를 가져온다.
            writer: true, title: true, likes: true, watch_count: true, created_at: true })
        .sort({ likes: -1 }).limit(3);

        if (!post) { // 포스팅이 없는 경우 
            console.log("Free post is empty");
            next();
        }

        const Page = [bestPost, post];
        console.log(Page);
        res.json(Page);
    } catch ( error ) {
        console.error(error);
        next(error);
    }
};

// post/honor
export const getHonorPosts = async (req, res, next ) => {
    const page = req.query.page || 1;
    const perPage = 7;

    try {
        const post = await Post.find({ types: 'HONOR' }, { 
            writer: true, title: true, likes: true, 
            watch_count: true, created_at: true } ).sort({ created_at: -1 }).skip((page - 1) * perPage).limit(perPage);

        const bestPost = await Post.find({ types: 'HONOR', likes: { $gte: 10 } } , { 
            writer: true, title: true, likes: true,
            watch_count: true, created_at: true } ).sort({ likes: -1 }).limit(3) // 명예게시판의 베스트 게시글 3개 가져오기

        if(!post) {
            console.log("Empty Honor Posting")
            next();
        }
        const Page = [bestPost, post];
        console.log(Page);
        res.json(Page);
        
    } catch ( error ) {
        console.error(error);
        next(error);
    }
};

// post/certify
export const getCertifyPosts = async (req, res, next ) => {
    const page = req.query.page || 1;
    const perPage = 7;

    try {
        const post = await Post.find({ types: 'CERTIFY' }, { writer: true, title: true, likes: true, 
        watch_count: true, created_at: true } )
        .sort({ created_at: -1 }) // 최신순 정렬해서 보여주기
        .skip((page - 1) * perPage)
        .limit(perPage);

        const bestPost = await Post.find({ types: 'CERTIFY', likes: { $gte: 10 } } , { writer: true, title: true, likes: true,
        watch_count: true, created_at: true } ).sort({ likes: -1 }).limit(3); // 헌혈인증게시판의 베스트 게시글 3개 가져오기

        if(!post) {
            console.log("Empty Certify Posting")
        } 
        const Page = [bestPost, post];
        console.log(Page);
        res.json(Page);
    } catch ( error ) {
        console.error(error);
        next(error);
    }
};

// post/info
export const getInfoPosts = async (req, res, next ) => {
    const page = req.query.page || 1;
    const perPage = 7;

    try {
        const post = await Post.find({ types: 'INFO' }, { writer: true, title: true, likes: true, 
        watch_count: true, created_at: true } )
        .sort({ created_at: -1 }) // 최신순 정렬해서 보여주기
        .skip((page - 1) * perPage)
        .limit(perPage);

        const bestPost = await Post.find({ types: 'INFO', likes: { $gte: 10 } } , { writer: true, title: true, likes: true,
        watch_count: true, created_at: true } ).sort({ likes: -1 }).limit(3); // 헌혈인증게시판의 베스트 게시글 3개 가져오기

        if(!post) {
            console.log("Empty Info Posting")
        } 
        const Page = [bestPost, post];
        console.log(Page);
        res.json(Page);
    } catch ( error ) {
        console.error(error);
        next(error);
    }
};

// /post/:id
export const viewPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findOneAndUpdate({ _id: id }, { $inc: { watch_count: +1 } }, { new: true });
        console.log(id);
        res.json(post);
    } catch ( error ) {
        console.error(error);
        next(error);
    }
};

// /post/{id}/
export const deletePost = async(req, res, next) => {
    try {
        console.log("check point");
        const postId = req.params.id;
        await Post.findByIdAndDelete({ _id: postId });
        console.log(`${postId} is deleted`); // 404 error occured
        res.send()
    } catch ( error ) {
        console.error(error);
        next(error);
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
        console.error(error);
        next(error);
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
        res.json(post);
    } catch ( error ) {
        console.error(error);
        next(error);
    }
}