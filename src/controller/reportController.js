import Report from '../schema/report.js';
import Post from '../schema/post.js';
import Comment from '../schema/comment.js';
import Chat from '../schema/chat.js';
import User from '../schema/user.js';
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
            const User = await Post.findById({ _id: targetId });
            temp.target_user = User.writer.id;
        }
        else if (targetType === 'COMMENT') { 
            temp.comment_id = targetId; 
            const User = await Comment.findById({ _id: targetId });
            temp.target_user = User.writer.id;
        }
        else if (targetType === 'CHAT') { 
            temp.chat_id = targetId; 
            const User = await Chat.findById({ _id: targetId });
            temp.target_user = User.writer.id;
        }
        if (!temp.target_user) { 
            const error = customErrResponse(status.BAD_REQUEST, "대상자가 유효하지 않습니다.");
            return next(res.send(error));
        }

        const saveNewReport = new Report(temp);
        await saveNewReport.save();
        req.body.newReport = saveNewReport;
        req.body.target_user = temp.target_user;
        checkStatus(req, res, next);
    } catch ( error ) {
        return res.send(error);
    }
}

export const checkStatus = async (req, res, next) => {
    try {
        const { targetType, targetId } = req.query;
        const targetUser = req.body.target_user;
        let reportArray;
        if (targetType === 'POST') {
            reportArray = await Report.find({ post_id: targetId });
            if (reportArray.length > 4) {
                await Post.findByIdAndUpdate({ _id: targetId }, { status: false }, { new: true });
            }
        }
        else if (targetType === 'COMMENT') {
            reportArray = await Report.find({ comment_id: targetId });
            if (reportArray.length > 4) {
                await Comment.findByIdAndUpdate({ _id: targetId }, { status: false }, { new: true });
            }
        }

        const cntReported = await Report.find({ target_user: targetUser });
        if (cntReported.length === 5) {
            await User.findByIdAndUpdate({ _id: targetUser }, { status: "inactive" }, { new: true });
        }

        return res.send(response(status.SUCCESS, req.body.newReport));
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}