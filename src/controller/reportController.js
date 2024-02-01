import Report from '../schema/report.js';
import { status } from "../config/responseStatus.js";
import { errResponse, response } from '../config/response.js';
import { checkStatus } from '../middleware/reportMiddleware.js';

export const postReport = async (req, res, next) => {
    try {
        const { _id, email } = req.user;
        const { targetType, reason } = req.query;
        const targetId = req.body.targetId;
        // console.log("testest");
        if (targetType === 'POST') {
            // console.log("testest");
            const newReport = new Report({
                claim_info: {
                    target: targetType,
                    reason: reason,
                },
                post_id: targetId,
                claimer: _id,
                created_at: Date.now()
            });
            await newReport.save();
        }
        else if (targetType === 'COMMENT') {
            const newReport = new Report({
                claim_info: {
                    target: targetType,
                    reason: reason,
                },
                comment_id: targetId,
                claimer: _id,
                created_at: Date.now()
            });
            await newReport.save();
        }
        checkStatus(req, res, next);
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}