import Report from '../schema/report.js';
import { status } from "../config/responseStatus.js";
import { errResponse, response } from '../config/response.js';

export const postReport = async (req, res, next) => {
    try {
        const { _id, email } = req.user;
        const { targetType, reason, targetId } = req.query;
        
        if (targetType === 'POST') {
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
    } catch ( error ) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}