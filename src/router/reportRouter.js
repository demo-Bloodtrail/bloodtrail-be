import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { checkReport } from '../middleware/reportMiddleware.js';

export const reportRouter = express.Router();

// 모든 경로에서 수행가능
reportRouter.post('/', authenticateUser, checkReport);
