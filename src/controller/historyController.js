import { status } from "../config/responseStatus.js";
import {
  response,
  errResponse,
  customErrResponse,
} from "../config/response.js";
import User from "../schema/user.js";
import History from "../schema/history.js";
import Crew from "../schema/crew.js";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { deleteImage } from "../middleware/imageMiddleware.js";

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
            // 사용자 포인트 수정
            await User.findByIdAndUpdate( _id, { $inc: { point: points } } );

            // 사용자 정보
            const user = await User.findById(_id);
            const crew = await Crew.findById(user.crew);

            // 사용자가 크루에 가입했을 경우, 크루 포인트와 참여율 수정
            if (user.crew) {
                const point = points; // 추가된 포인트
                const [existingPoint, existingRate] = crew.now;

                const updatedPoint = existingPoint + point; // 기존 crew point + 추가 point
                const updatedRate = (updatedPoint / crew.goal[0]) * 100; // crew participation rate

                crew.now = [updatedPoint, updatedRate];

                await crew.save();
            }
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
 * [GET] /history
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

        let points = 0;
        // 2. type이 변경된 경우 포인트 수정
        if (oldHistory.type !== type) {
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

        // 사용자 정보
        const user = await User.findById(_id);
        const crew = await Crew.findById(user.crew);

        // 사용자가 크루에 가입했을 경우, 크루 포인트와 참여율 수정
        if (user.crew) {
            const point = points; // 수정된 포인트
            const [existingPoint, existingRate] = crew.now;

            const updatedPoint = existingPoint + point; // 기존 crew point + 수정된 point
            const updatedRate = (updatedPoint / crew.goal[0]) * 100; // crew participation rate

            crew.now = [updatedPoint, updatedRate];

            await crew.save();
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

        // 사용자 정보
        const user = await User.findById(_id);
        const crew = await Crew.findById(user.crew);

        // 사용자가 크루에 가입했을 경우, 크루 포인트와 참여율 수정
        if (user.crew) {
            const point = points; // 수정된 포인트
            const [existingPoint, existingRate] = crew.now;

            const updatedPoint = existingPoint + point; // 기존 crew point + 수정된 point
            const updatedRate = (updatedPoint / crew.goal[0]) * 100; // crew participation rate

            crew.now = [updatedPoint, updatedRate];

            await crew.save();
        }

        await History.findByIdAndDelete(historyId);

        return res.send(response(status.SUCCESS, "헌혈 정보를 삭제했습니다."));
    } catch (err) {
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

/*
 * API No. 6
 * API Name : 헌혈 증서 이미지 텍스트 추출
 * [POST] /history/image
 */
export const imageToText = async(req, res, next) => {
    try {
        // 이미지 가져오기
        const file = req.files;

        let fileUrl = null;
        if (file && file.length != 0) {
            fileUrl = file.map((file) => file.location); // S3에 업로드된 이미지 URL
            console.log("이미지 업로드 url : " + fileUrl);
        }

        // 이미지에서 텍스트 추출
        const client = new ImageAnnotatorClient({
            keyFileName: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });

        // console.log(fileUrl);
        
        const [result] = await client.textDetection(fileUrl[0]);
        const detections = result.textAnnotations;

        console.log("이미지 텍스트 변환 완료");

        // detections.forEach(text => console.log(text));

        // 성명 정보 추출
        const nameRegex = /성\s*:\s*([^\n]+)/;
        const nameMatch = detections[0].description.match(nameRegex);
        const name = nameMatch ? nameMatch[1].replace(/\s/g, '') : '';

        // 생년월일 정보 추출
        const birthRegex = /생년월일\s*:\s*([^\n]+)/;
        const birthMatch = detections[0].description.match(birthRegex);
        const birth = birthMatch ? birthMatch[1].replace(/\s/g, '') : '';

        // 헌혈 일자 정보 추출
        const dateRegex = /헌혈일자\s*:\s*([^\n]+)/;
        const dateMatch = detections[0].description.match(dateRegex);
        const date = dateMatch ? dateMatch[1].replace(/\s/g, '') : '';

        // 혈액 종류 정보 추출
        const typeRegex = /혈액종류\s*:\s*([^\n]+)/;
        const typeMatch = detections[0].description.match(typeRegex);
        const type = typeMatch ? typeMatch[1].replace(/\s/g, '') : '';

        console.log(name, birth, date, type);

        const info = {
            name: name,
            birth: birth,
            date: date,
            type: type,
        };
        
        // S3 업로드 된 이미지 삭제
        try {
            await deleteImage(fileUrl[0]);
            console.log("이미지 삭제 성공");
        } catch (err) {
            return res.send(err);
        }

        return res.send(response(status.SUCCESS, info));
    } catch (err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};

/*
 * API No. 7
 * API Name : 전혈 가능 날짜 조회
 * [GET] /history/date
 */
export const getAvailableDate = async(req, res, next) => {
    const { _id, email } = req.user;
    
    try {
        // 최신 헌혈 정보 조회
        const lastDonation = await History.findOne({ user: _id, type: 'WB' }).sort({ created_at: -1 });

        if (!lastDonation) {
            return res.send(errResponse(status.HISTORY_NOT_FOUND));
        }

        // 전혈 헌혈 가능 날짜 계산
        const nextDonation = new Date(lastDonation.created_at);
        nextDonation.setDate(nextDonation.getDate() + 56);

        // 디데이로 표시
        const today = new Date();
        const timeDifference = nextDonation - today;
        const d_day = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return res.send(response(status.SUCCESS, d_day));
    } catch (err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
};