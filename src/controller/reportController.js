import Report from '../schema/report';
import User from '../schema/user';
import Chat from '../schema/user';
import Post from '../schema/post';
import { status } from '../config/responseStatus.js';
import {
    response,
    errResponse,
    customErrResponse,
} from '../config/response.js';

export const postNewReport = async (req, res, next) => {
    try {
        const { info, id, claimer } = req.body;
        if (info.about === "post") {
            const newReport = new Report({
                info,
                post_info: id,
                claimer,
                created_at: Date.now()
            });
            await newReport.save();
            return res.json(response(status.SUCCESS, newReport));
        }
        else {
            const newReport = new Report({
                info,
                chat_info: id,
                claimer,
                created_at: Date.now()
            });
            await newReport.save();
            return res.json(response(status.SUCCESS, newReport));
        }
    } catch ( error ) {
        res.status(500).json(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}