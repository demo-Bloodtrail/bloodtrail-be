import { status } from "../config/responseStatus.js";
import { response, errResponse, customErrResponse } from "../config/response.js";
import { postReport } from '../controller/reportController.js';

const CLAIMTYPE = ['UNHEALTHY', 'FINANCE', 'FRAUD', 'ABUSE', 'ETC'];
const TARGETTYPE = ['POST', 'COMMENT'];

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

        postReport(req, res, next);
    } catch ( error ) {
        return res.send( error );
    }
}