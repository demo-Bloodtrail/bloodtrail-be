import { status } from "../config/responseStatus.js";
import { response, errResponse, customErrResponse } from "../config/response.js";
import { postReport } from '../controller/reportController.js';
import Post from '../schema/post.js';
import Comment from '../schema/comment.js';
import Report from '../schema/report.js';

const CLAIMTYPE = ['UNHEALTHY', 'FINANCE', 'FRAUD', 'ABUSE', 'ETC'];
const TARGETTYPE = ['POST', 'COMMENT'];

// 버그 발생 해결방법 모르겠음
export const checkReport = async (req, res, next) => {
    try {
        const { targetType, reason } = req.query;

        if (!TARGETTYPE.includes(targetType)) {
            const error = customErrResponse(status.BAD_REQUEST, "유효하지 않은 신고대상입니다.");
            return next(res.send(error));
        }

        if (!CLAIMTYPE.includes(reason)) {
            const error = customErrResponse(status.BAD_REQUEST, "유효하지 않은 신고타입입니다.");
            return next(res.send(error));
        }

        await postReport(req, res, next);
        // console.log("testest1");
        await checkStatus(req, res, next);
        // console.log("testest2");
        return res.send(response(status.SUCCESS));
    } catch ( error ) {
        // console.log("du");
        return res.send( error );
    }
}

const checkStatus = async (req, res, next) => {
    const { targetType, targetId } = req.query;

    if (targetType === 'POST') {
        const reportArray = await Report.find({ post_id: targetId }).populate({ path:'post_id' });
        // console.log(reportArray.length);
        if (reportArray.length > 4) {
            await Post.findByIdAndUpdate({ _id: targetId }, { status: false }, { new: true });
        }
    }
    else if (targetType === 'COMMENT') {
        const reportArray = await Report.find({ comment_id: targetId }).populate({ path: 'comment_id' });''
        if (reportArray.length > 4) {
            await Comment.findByIdAndUpdate({ _id: targetId }, { status: false }, { new: true });
        }
    }
}