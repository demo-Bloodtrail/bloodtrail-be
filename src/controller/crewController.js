import { status } from "../config/responseStatus.js";
import {
  response,
  errResponse,
  customErrResponse,
} from "../config/response.js";
import User from "../schema/user.js";
import Crew from "../schema/crew.js";

/*
 * API No. 1
 * API Name : 크루 생성 API
 * [POST] /crew
 */
export const createCrew = async(req, res, next) => {
    const { _id, email } = req.user;
    const { name, goal_point, goal_rate, description } = req.body;
    
    try {
        // 유효성 검사
        if (!name || !goal_point || !goal_rate || !description) {
            console.log("필드를 모두 입력해주세요.");
            return res.send(customErrResponse(status.BAD_REQUEST, "필드를 모두 입력해주세요."));
        }

        // 크루 리더 크루 가입 여부 확인
        const leader = await User.findById(_id);

        if (leader.crew) {
            return res.send(errResponse(status.CREW_ALREADY_JOIN));
        }

        // 크루 생성
        const newCrew = new Crew({
            crew_name: name,
            crew_image: leader.profile_image,
            crew_leader: _id,
            crew_member: [ _id ],
            goal: [goal_point, goal_rate],
            now: [leader.point, (leader.point / goal_point) * 100],
            description: description,
        });

        // 크루 리더 크루 정보 추가
        leader.crew = newCrew._id;
        await leader.save();

        const result = await newCrew.save();

        return res.send(response(status.SUCCESS, result));
    } catch(err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

/*
 * API No. 2
 * API Name : 크루 이름 중복 확인 API
 * [POST] /crew/check-name
 */
export const checkName = async(req, res, next) => {
    const { _id, email } = req.user;
    const { name } = req.body;

    try {
        // 유효성 검사
        if (!name) {
            console.log("필드를 모두 입력해주세요.");
            return res.send(customErrResponse(status.BAD_REQUEST, "필드를 모두 입력해주세요."));
        }

        // 크루 이름 중복 확인
        const existingCrew = await Crew.findOne({ crew_name: name });

        if (existingCrew) {
            return res.send(errResponse(status.CREW_NAME_ALREADY_EXIST));
        }
        
        return res.send(response(status.SUCCESS, { isDuplicate: false }));
    } catch (err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

/*
 * API No. 3
 * API Name : 크루 전체 조회 API (9개씩 페이징)
 * [GET] /crew
 */
export const getAllCrew = async(req, res, next) => {
    const { _id, email } = req.user;
    const page = req.query.page || 1;
    const perPage = 9;

    try {
        const crewList = await Crew.find()
            .sort({ created_date: -1 }) // 최신순
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate(
                {
                    path: "crew_leader",
                    select: "profile_image",
                }
            );

        const result = {
            crewList: crewList,
            currentPage: parseInt(page),
            totalPage: Math.ceil(crewList.length / 9),
        };
    
        return res.send(response(status.SUCCESS, result));
    } catch(err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

/*
 * API No. 4
 * API Name : 크루 상세 조회 API
 * [GET] /crew/:crewId
 */
export const getCrew = async(req, res, next) => {
    const crewId = req.params.crewId;
    const { _id, email } = req.user;
    
    try {
        const crew = await Crew.findById(crewId);

        if (!crew) {
            return res.send(errResponse(status.CREW_NOT_FOUND));
        }

        // crew_member populate
        const crew_member = await Promise.all(
            crew.crew_member.map(async(member_id) => {
                const member = await User.findById(member_id).select("name profile_image point");
                return {
                    ...member.toObject(),
                    participationRate: (member.point / crew.goal[0]) * 100,
                };
            })
        );

        const result = {
            crew: crew,
            crew_member: crew_member,
        }

        return res.send(response(status.SUCCESS, result));
    } catch (err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}

/*
 * API No. 5
 * API Name : 크루 가입 API
 * [POST] /crew/:crewId
 */
export const joinCrew = async(req, res, next) => {
    const crewId = req.params.crewId;
    const { _id, email } = req.user;

    try {
        // 사용자의 크루 가입 여부 확인 (다른 크루 포함)
        const member = await User.findById(_id);

        if (member.crew) {
            return res.send(errResponse(status.CREW_ALREADY_JOIN));
        }

        console.log(member.crew);

        // 사용자의 정보에 크루 추가
        member.crew = crewId;

        await member.save();

        // 크루 멤버 추가
        const crew = await Crew.findById(crewId);

        crew.crew_member.push(_id); // crew_member 추가
        crew.crew_count += 1; // crew_count 추가

        const point = member.point; // member 포인트
        const [existingPoint, existingRate] = crew.now;

        const updatedPoint = existingPoint + point; // 기존 crew point + 신규 member point
        const updatedRate = (updatedPoint / crew.goal[0]) * 100; // 신규 crew participation rate

        crew.now = [updatedPoint, updatedRate];

        await crew.save();

        return res.send(response(status.SUCCESS, crew));
    } catch (err) {
        console.log(err);
        return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
    }
}