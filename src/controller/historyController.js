import { status } from "../config/responseStatus.js";
import {
  response,
  errResponse,
  customErrResponse,
} from "../config/response.js";
import User from "../schema/user.js";
import History from "../schema/history.js";

/*
 * API No. 1
 * API Name : 헌혈 정보 등록 API
 * [POST] /history
 */
export const postHistory = async(req, res, next) => {
    try {
        const { _id, email } = req.user;
        const { name, birth, type, date } = req.body;

        // 유효성 검사
        if (!type || !date) {
            console.log("필드를 모두 입력해주세요.");
            return res.send(customErrResponse(status.BAD_REQUEST, "필드를 모두 입력해주세요."));
        }

        // 포인트 추가
        let points = 0;

        if (type === 'WB') {
            points = 3;
        } else if (type === "PB" || type === "PLB") {
            points = 1;
        } else {
            points = 0;
        }

        if (points > 0) {
            await User.findByIdAndUpdate( _id, { $inc: { point: points } } );
        }

        // 헌혈 정보 등록
        const newHistory = new History({
            type,
            date,
            user: _id,
        });

        const result = await newHistory.save();
        
        console.log("newHistory가 저장됨");

        return res.send(response(status.SUCCESS, result));
    } catch (err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

/*
 * API No. 2
 * API Name : 헌혈 정보 전체 조회 API (10개씩 페이징)
 * [GET] /history/:page
 */
export const getAllHistories = async(req, res, next) => {
    const { _id, email } = req.user;
    const page = req.query.page || 1;
    const perPage = 10;

    try {
        const historyList = await History.find({ user: _id })
            .sort({ created_date: -1 }) // 최신순
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate(
                {
                    path: "user",
                    select: "name birth",
                }
            );

        console.log(historyList);
        
        const result = {
            historyList: historyList,
            currentPage: parseInt(page),
            totalPage: Math.ceil(historyList.length / 10),
        };

        return res.send(response(status.SUCCESS, result));
    } catch (err) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

/*
 * API No. 3
 * API Name : 헌혈 정보 상세 조회 API
 * [GET] /history/:historyId
 */
export const getHistory = async(req, res, next) => {
    const historyId = req.params.historyId;
    const { _id, email } = req.user;

    console.log(historyId);
    
    try {
        const history = await History.findById(historyId).populate({
            path: "user",
            select: "name birth",
        });

        if (!history) {
            return res.send(errResponse(status.HISTORY_NOT_FOUND));
        }

        return res.send(response(status.SUCCESS, history));
    } catch (err) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

/*
 * API No. 4
 * API Name : 헌혈 정보 수정 API
 * [PATCH] /history/:historyId
 */
export const updateHistory = async(req, res, next) => {
    const historyId = req.params.historyId;
    const { _id, email } = req.user;
    const { type, date } = req.body;

    try {
        // 유효성 검사
        if (!type || !date) {
            return res.send(customErrResponse(status.BAD_REQUEST, "필드를 모두 입력해주세요."));
        }

        // 1. 기존 헌혈 정보의 type 받아오기
        const oldHistory = await History.findById(historyId);

        if (!oldHistory) {
            return res.send(errResponse(status.HISTORY_NOT_FOUND));
        }

        // 2. type이 변경된 경우 포인트 수정
        if (oldHistory.type !== type) {
            let points = 0;

            if ((oldHistory.type === 'WB') && (type === 'PB' || type === 'PLB')) {
                points = -2;
            } else if ((oldHistory.type === 'PB' || oldHistory.type === 'PLB') && type === 'WB') {
                points = 2;
            }

            const updatedUser = await User.findByIdAndUpdate(
                _id,
                { $inc: { point: points } }
            );
        }

        // 헌혈 정보 수정
        const updatedHistory = await History.findByIdAndUpdate(
            historyId,
            { type, date },
            { new: true }
        );

        return res.send(response(status.SUCCESS, updatedHistory));
    } catch (err) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

/*
 * API No. 5
 * API Name : 헌혈 정보 삭제 API
 * [DELETE] /history/:historyId
 */
export const deleteHistory = async(req, res, next) => {
    const historyId = req.params.historyId;
    const { _id, email } = req.user;

    try {
        // 1. 기존 헌혈 정보의 type 받아오기
        const oldHistory = await History.findById(historyId);

        if (!oldHistory) {
            return res.send(errResponse(status.HISTORY_NOT_FOUND));
        }

        // 2. 포인트 수정
        let points = 0;

        if (oldHistory.type === "WB") {
            points = -3;
        } else if (oldHistory.type === "PB" || oldHistory.type === "PLB") {
            points = -1;
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $inc: { point: points } }
        );

        await History.findByIdAndDelete(historyId);

        return res.send(response(status.SUCCESS, "헌혈 정보를 삭제했습니다."));
    } catch (err) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};