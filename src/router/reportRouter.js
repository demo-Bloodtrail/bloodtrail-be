import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { checkReport } from '../middleware/reportMiddleware.js';



// 신고 5번이 누적되면 status 변경

// 신고하기 기능 만들기
// const doctype = ['POST', 'CHAT', 'COMMNET'];

// export const postReport = async (req, res, next) => {
//     try {
//         const { _id, email } = req.user;
//     } catch ( error ) {
//         res.send(errResponse())
//     }
// }


export const reportRouter = express.Router();

reportRouter.post('/', authenticateUser, checkReport);
