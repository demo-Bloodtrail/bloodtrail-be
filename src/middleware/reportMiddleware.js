import { status } from "../config/responseStatus.js";
import { response, errResponse, customErrResponse } from "../config/response.js";
import { postReport } from '../controller/reportController.js';
import Report from '../schema/report.js';

const CLAIMTYPE = ['UNHEALTHY', 'FINANCE', 'FRAUD', 'ABUSE', 'ETC'];
const TARGETTYPE = ['POST', 'COMMENT', 'CHAT'];

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
        checkAlreadyReport(req, res, next);
    } catch ( error ) {
        return res.send( error );
    }
}

const checkAlreadyReport = async (req, res, next) => {
    const { targetType, targetId } = req.query;
    const { _id, email } = req.user;

    let existReport;

    if (targetType === 'POST') {
        existReport = await Report.findOne({ post_id: targetId, claimer: _id });
        if (existReport) {
            const error = customErrResponse(status.BAD_REQUEST, "이미 신고한 게시글입니다.");
            return next(res.send(error));
        }
    }
    else if (targetType === 'CHAT'){
        existReport = await Report.findOne({ comment_id: targetId, claimer: _id });
        if (existReport) {
            const error = customErrResponse(status.BAD_REQUEST, "이미 신고한 댓글입니다.");
            return next(res.send(error));
        }
    }
    else {
        existReport = await Report.findOne({ chat_id: targetId, claimer: _id });
        if (existReport) {
            const error = customErrResponse(status.BAD_REQUEST, "이미 신고한 채팅입니다.");
            return next(res.send(error));
        }
    }
    postReport(req, res, next);
}