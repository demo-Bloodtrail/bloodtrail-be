import { getLinePosting, getGalleryPosting, postNewPost } from "../controller/postController.js";
import { status } from "../config/responseStatus.js";
import { response, errResponse } from "../config/response.js";
import User from '../schema/user.js';

const POSTTYPE = ['FREE', 'HONOR', 'CERTIFY', 'INFO'];
const SORTTYPE = ['created_at', 'likes'];

export const checkPosting = async (req, res, next) => {
    try {
        const pagetype = req.query.pagetype;

        if (!POSTTYPE.includes(req.query.posttype)) throw error;
        if (!SORTTYPE.includes(req.query.sorttype)) throw error;
        if (pagetype === 'line') await getLinePosting(req, res, next);
        else if (pagetype === 'gallery') await getGalleryPosting(req, res, next);
        else throw error;
    } catch ( error ) {
        res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const checkPost = async (req, res, next) => {
    const newPost = req.body;

    const { _id, email } = req.user;

    if (!newPost.title) {
        return res.send(errResponse(status.BAD_REQUEST));
    }

    if (!newPost.types) {
        return res.send(errResponse(status.BAD_REQUEST));
    }

    if (!POSTTYPE.includes(newPost.types)) {
        return res.send(errResponse(status.BAD_REQUEST));
    }

    if (!newPost.content) {
        return res.send(errResponse(status.BAD_REQUEST));
    }

    const user = await User.findById(_id);
    if (newPost.types === 'HONOR' && user.premium === false) {
        return res.send(errResponse(status.BAD_REQUEST));
    }

    postNewPost(req, res, next);
}