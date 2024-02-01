import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { checkReport } from '../middleware/reportMiddleware.js';

export const reportRouter = express.Router();

reportRouter.post('/', authenticateUser, checkReport);
