import { status } from "../config/responseStatus.js";
import {
  response,
  errResponse,
  customErrResponse,
} from "../config/response.js";
import User from "../schema/user.js";
import Crew from "../schema/crew.js";
import ChatRoom from "../schema/chatRoom.js";

/*
 * API No. 1
 * API Name : 크루 생성 API
 * [POST] /crew
 */
export const createCrew = async (req, res, next) => {
  const { _id, email } = req.user;
  const { name, goal_point, goal_rate, description } = req.body;

  try {
    // 유효성 검사
    if (!name || !goal_point || !goal_rate || !description) {
      console.log("필드를 모두 입력해주세요.");
      return res.send(
        customErrResponse(status.BAD_REQUEST, "필드를 모두 입력해주세요.")
      );
    }

    // 크루 리더 크루 가입 여부 확인
    const leader = await User.findById(_id);

    if (leader.crew) {
      return res.send(errResponse(status.CREW_ALREADY_JOIN));
    }

    // 채팅방 생성
    const newChatRoom = new ChatRoom({
      joiner: _id,
      type: "crew",
      title: name,
    });

    const savedChatRoom = await newChatRoom.save();
    const io = req.app.get("io"); // io 가져오기

    io.of("/chatRoom").emit("newRoom", savedChatRoom);
    const chatRoomURI = "/chatRoom/" + savedChatRoom._id;

    // 크루 생성
    const newCrew = new Crew({
      crew_name: name,
      crew_image: leader.profile_image,
      crew_leader: _id,
      crew_member: [_id],
      goal: [goal_point, goal_rate],
      now: [leader.point, (leader.point / goal_point) * 100],
      description: description,
      chat: chatRoomURI,
    });

    const result = await newCrew.save();

    // 크루 리더 크루 정보 추가
    leader.crew = newCrew._id;
    await leader.save();

    return res.send(response(status.SUCCESS, result));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 2
 * API Name : 크루 이름 중복 확인 API
 * [POST] /crew/check-name
 */
export const checkName = async (req, res, next) => {
  const { _id, email } = req.user;
  const { name } = req.body;

  try {
    // 유효성 검사
    if (!name) {
      console.log("필드를 모두 입력해주세요.");
      return res.send(
        customErrResponse(status.BAD_REQUEST, "필드를 모두 입력해주세요.")
      );
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
};

/*
 * API No. 3
 * API Name : 크루 전체 조회 API (9개씩 페이징)
 * [GET] /crew
 */
export const getAllCrew = async (req, res, next) => {
  const { _id, email } = req.user;
  const page = req.query.page || 1;
  const perPage = 9;

  try {
    const crewList = await Crew.find()
      .sort({ created_date: -1 }) // 최신순
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "crew_leader",
        select: "profile_image",
      });

    const result = {
      crewList: crewList,
      currentPage: parseInt(page),
      totalPage: Math.ceil(crewList.length / 9),
    };

    return res.send(response(status.SUCCESS, result));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 4
 * API Name : 크루 상세 조회 API
 * [GET] /crew/:crewId
 */
export const getCrew = async (req, res, next) => {
  const crewId = req.params.crewId;
  const { _id, email } = req.user;

  try {
    const crew = await Crew.findById(crewId);

    if (!crew) {
      return res.send(errResponse(status.CREW_NOT_FOUND));
    }

    // crew_member populate
    const crew_member = await Promise.all(
      crew.crew_member.map(async (member_id) => {
        const member = await User.findById(member_id).select(
          "name profile_image point"
        );
        return {
          ...member.toObject(),
          participationRate: (member.point / crew.goal[0]) * 100,
        };
      })
    );

    const result = {
      crew: crew,
      crew_member: crew_member,
    };

    return res.send(response(status.SUCCESS, result));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 5
 * API Name : 크루 가입 API
 * [POST] /crew/:crewId
 */
export const joinCrew = async (req, res, next) => {
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
};

/*
 * API No. 6
 * API Name : 나의 크루 조회 API
 * [GET] /crew/mycrew
 */
export const getMyCrew = async (req, res, next) => {
  const { _id, email } = req.user;

  try {
    const user = await User.findById(_id);

    if (!user.crew) {
      return res.send(errResponse(status.CREW_NOT_JOIN));
    }

    const crew = await Crew.findById(user.crew).populate({
      path: "crew_leader",
      select: "profile_image",
    });

    return res.send(response(status.SUCCESS, crew));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 7
 * API Name : 헌혈 크루 순위 조회 API
 * [GET] /crew/rank
 */
export const getRankCrew = async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = 6;

  try {
    const crewList = await Crew.find()
      .sort({ now: -1 }) // 포인트 순
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "crew_leader",
        select: "profile_image",
      });

    const result = {
      crewList: crewList,
      currentPage: parseInt(page),
      totalPage: Math.ceil(crewList.length / 6),
    };

    return res.send(response(status.SUCCESS, result));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 8
 * API Name : 크루 검색 API
 * [GET] /crew/search
 */
export const findCrew = async (req, res, next) => {
  const { _id, email } = req.user;
  const keyword = req.query.keyword;

  try {
    // 유효성 검사
    if (!keyword || keyword === " ") {
      return res.send(errResponse(status.CREW_NOT_KEYWORD));
    }

    const regex = new RegExp(keyword, "i"); // 대소문자 구분 X

    const crewList = await Crew.find({ crew_name: { $regex: regex } }).populate(
      {
        path: "crew_leader",
        select: "profile_image",
      }
    );

    return res.send(response(status.SUCCESS, crewList));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};

/*
 * API No. 9
 * API Name : 크루 탈퇴 API
 * [PATCH] /crew/:crewId
 */
export const withdrawCrew = async (req, res, next) => {
  const crewId = req.params.crewId;
  const { _id, email } = req.user;

  try {
    const crew = await Crew.findById(crewId);

    // 크루 리더인지 크루 멤버인지 확인
    const isLeader = crew.crew_leader.equals(_id);

    // 크루 멤버의 인덱스
    const index = crew.crew_member.indexOf(_id);

    // 사용자 정보 수정
    const member = await User.findById(_id);
    member.crew = null;

    await member.save();

    // 크루 리더일 경우
    if (isLeader) {
      if (crew.crew_member.length > 1) {
        // 크루에 다른 크루 멤버가 존재할 경우
        const newLeader = crew.crew_member[1];
        crew.crew_leader = newLeader;
      } else {
        // 크루에 다른 크루 멤버가 존재하지 않을 경우
        await Crew.findByIdAndDelete(crewId);
        return res.send(response(status.SUCCESS, "크루가 삭제되었습니다."));
      }
    }

    // 크루 정보 수정
    const point = member.point;
    const [existingPoint, existingRate] = crew.now;

    const updatedPoint = existingPoint - point;
    const updatedRate = (updatedPoint / crew.goal[0]) * 100;

    crew.crew_member.splice(index, 1);
    crew.crew_count -= 1;
    crew.now = [updatedPoint, updatedRate];

    await crew.save();

    return res.send(response(status.SUCCESS, crew));
  } catch (err) {
    console.log(err);
    return res.send(errResponse(status.INTERNAL_SERVER_ERROR));
  }
};
