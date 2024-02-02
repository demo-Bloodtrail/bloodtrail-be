import Report from '../schema/report.js';
import Post from '../schema/post.js';
import { status } from "../config/responseStatus.js";
import { errResponse, response } from '../config/response.js';

export const postReport = async (req, res, next) => {
    try {
        const { _id, email } = req.user;
        const { targetType, reason, targetId } = req.query;
        const temp = new Report({
            claim_info: {
                target: targetType,
                reason: reason,
            },
            claimer: _id,
        });

        if (targetType === 'POST') {
            temp.post_id = targetId;
        }
        else {
            temp.comment_id = targetId;
        }

        const saveNewReport = new Report(temp);
        await saveNewReport.save();
        checkStatus(req, res, next);
    } catch ( error ) {
        return res.send(error);
    }
}

export const checkStatus = async (req, res, next) => {
    try {
        const { targetType, targetId } = req.query;
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
        return res.send(response(status.SUCCESS));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}