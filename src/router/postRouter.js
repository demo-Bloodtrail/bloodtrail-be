import express from 'express';
import { getFreePosts, getHonorPosts, getCertifyPosts, getInfoPosts } from '../controller/postController.js';
import { viewPost, deletePost, postNewPost, amendPost } from '../controller/postController.js';
import { checkNewPost } from '../middleware/postMiddleware.js';
import { patchLike, postComment } from '../controller/commentController.js';

export const postRouter = express.Router();

postRouter.get('/free', getFreePosts);
postRouter.get('/honor', getHonorPosts);
postRouter.get('/certify', getCertifyPosts);
postRouter.get('/info', getInfoPosts);
postRouter.post('/newpost', checkNewPost, postNewPost);

postRouter.patch('/:id', viewPost);
postRouter.delete('/:id', deletePost);
postRouter.patch('/:id/like', patchLike);
postRouter.patch('/:id/amend', amendPost);
postRouter.post('/:id/comment', postComment);