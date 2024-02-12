import { status } from "../config/responseStatus.js";
import {
  response,
  errResponse,
  customErrResponse,
} from "../config/response.js";
import Notice from "../schema/notice.js";

/*
 * API No. 1
 * API Name : 알림 생성 API
 * [POST] /notice
 */
export const createNotice = async(req, res, next) => {
    const { _id, email } = req.user;
    const { content, url, user } = req.body;
    try {
        // 유효성 검사
        if (!content || !url || !user) {
            console.log("필드를 모두 입력해주세요.");
            return res.send(customErrResponse(status.BAD_REQUEST, "필드를 모두 입력해주세요."));
        }

        const newNotice = new Notice({
            content: content,
            url: url,
            user: user,
        });

        const result = await newNotice.save();

        return res.send(response(status.SUCCESS, result));
    } catch (err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

/*
 * API No. 2
 * API Name : 알림 조회 API
 * [GET] /notice
 */
export const getAllNotice = async(req, res, next) => {
    const { _id, email } = req.user;
    try {
        const noticeList = await Notice.find({ user: _id }).sort({ created_at: -1 });

        return res.send(response(status.SUCCESS, noticeList));
    } catch(err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};