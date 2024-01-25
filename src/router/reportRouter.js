import express from 'express';
import { postNewReport } from '../controller/reportController.js';
import { checkNewReport } from '../middleware/reportMiddleware.js';

export const reportRouter = express.Router();

reportRouter.post('/', checkNewReport, postNewReport);