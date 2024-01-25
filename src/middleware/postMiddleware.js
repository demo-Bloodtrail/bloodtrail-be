import { errResponse } from "../config/response.js";
import { status } from "../config/responseStatus.js";
import { getFreePosts, getHonorPosts, getCertifyPosts, getInfoPosts} from "../controller/postController.js";
import { getFreePostGallery, getHonorPostGallery, getCertifyPostGallery, getInfoPostGallery } from "../controller/postController.js";

export const checkGetFreeType = async (req, res, next) => {
    try {
        const type = req.query.type;
        if (type === 'gallery') await getFreePostGallery(req, res, next);
        else if (type === 'line') await getFreePosts(req, res, next);
        else {
            return res.send(errResponse(status.BAD_REQUEST));
        }
    } catch (error) {
        next(error);
    }
}

export const checkGetHonorType = async (req, res, next) => {
    try {
        const type = req.query.type;
        if (type === 'gallery') await getHonorPostGallery(req, res, next);
        else if (type === 'line') await getHonorPosts(req, res, next);
        else {
            return res.send(errResponse(status.BAD_REQUEST));
        }
    } catch (error) {
        next(error);
    }
}

export const checkGetCertifyType = async (req, res, next) => {
    try {
        const type = req.query.type;
        if (type === 'gallery') await getCertifyPostGallery(req, res, next);
        else if (type === 'line') await getCertifyPosts(req, res, next);
        else {
            return res.send(errResponse(status.BAD_REQUEST));
        }
    } catch (error) {
        next(error);
    }
}

export const checkGetInfoType = async (req, res, next) => {
    try {
        const type = req.query.type;
        if (type === 'gallery') await getInfoPostGallery(req, res, next);
        else if (type === 'line') await getInfoPosts(req, res, next);
        else {
            return res.send(errResponse(status.BAD_REQUEST));
        }
    } catch (error) {
        next(error);
    }
}

// newposting 에서 필수 항목이 채워지지 않은 경우
export const checkPost = async (req, res, next) => {
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