import { status } from "../config/responseStatus.js";
import { response, errResponse, customErrResponse } from "../config/response.js";
import { postReport } from '../controller/reportController.js';
import Post from '../schema/post.js';
import Comment from '../schema/comment.js';
import Report from '../schema/report.js';

const CLAIMTYPE = ['UNHEALTHY', 'FINANCE', 'FRAUD', 'ABUSE', 'ETC'];
const TARGETTYPE = ['POST', 'COMMENT'];

export const checkReport = async (req, res, next) => {
    try {
        const { targetType, reason } = req.query;
        // console.log("testest");
        if (!TARGETTYPE.includes(targetType)) {
            const error = customErrResponse(status.BAD_REQUEST, "유효하지 않은 신고대상입니다.");
            return next(res.send(error));
        }

        if (!CLAIMTYPE.includes(reason)) {
            const error = customErrResponse(status.BAD_REQUEST, "유효하지 않은 신고타입입니다.");
            return next(res.send(error));
        }
        // console.log("testest");
        postReport(req, res, next);
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

export const checkStatus = async (req, res, next) => {
    try {
        const { targetType } = req.query;
        const targetId = req.body.targetId;

        if (targetType === 'POST') {
            const reportArray = await Report.find({ post_id: targetId });
            if (reportArray.length > 4) {
                await Post.findByIdAndUpdate({ _id: targetId }, { status: false }, { new: true });
            }
        }
        else if (targetType === 'COMMENT') {
            const reportArray = await Report.find({ comment_id: targetId });
            if (reportArray.length > 4) {
                await Comment.findByIdAndUpdate({ _id: targetId }, { status: false }, { new: true });
            }
        }

        return res.send(response(status.SUCCESS, "게시글 신고 성공"));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}