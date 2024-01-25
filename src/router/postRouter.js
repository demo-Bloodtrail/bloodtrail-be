import express from 'express';
import { checkGetFreeType, checkGetHonorType, checkGetCertifyType, checkGetInfoType } from '../middleware/postMiddleware.js';
import { viewPost, deletePost, postNewPost } from '../controller/postController.js';
import { checkPost } from '../middleware/postMiddleware.js';
import { patchLike, postComment, amendPost } from '../controller/commentController.js';

export const postRouter = express.Router();

postRouter.get('/free', checkGetFreeType);
postRouter.get('/honor', checkGetHonorType);
postRouter.get('/certify', checkGetCertifyType);
postRouter.get('/info', checkGetInfoType);

postRouter.post('/newpost', checkPost, postNewPost);

postRouter.patch('/:id', viewPost);
postRouter.delete('/:id', deletePost);
postRouter.patch('/:id/like', patchLike);
postRouter.patch('/:id/amend', checkPost, amendPost);
postRouter.post('/:id/comment', postComment);