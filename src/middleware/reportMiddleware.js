import { errResponse } from "../config/response.js";
import { status } from "../config/responseStatus.js";
import Post from '../schema/post.js';
import Chat from '../schema/chat.js';

// newposting 에서 필수 항목이 채워지지 않은 경우
export const checkNewReport = async (req, res, next) => {
    const newReport = req.body;

    if (!newReport.info.detail) {
        return res.json(errResponse(status.BAD_REQUEST));
    }

    if (newReport.info.about !== 'post' && newReport.info.about !== 'chat') {
        return res.json(errResponse(status.BAD_REQUEST));
    }

    if (!newReport.info.about) {
        return res.json(errResponse(status.BAD_REQUEST));
    }

    if (!newReport.claimer) {
        return res.json(errResponse(status.BAD_REQUEST));
    }
    next();
}
