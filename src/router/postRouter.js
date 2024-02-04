import express from 'express';
import { checkPosting } from '../middleware/postMiddleware.js';
import { viewPost, deletePost, amendPost, getHomePosts } from '../controller/postController.js';
import { checkPost } from '../middleware/postMiddleware.js';
import { patchLike, deleteLike, postComment } from '../controller/commentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { uploadSome } from "../middleware/imageMiddleware.js";

export const postRouter = express.Router();

// 게시판 조회하기
postRouter.get('/', authenticateUser, checkPosting);

// 글 작성하기
postRouter.post('/', authenticateUser, uploadSome, checkPost);

// 글 조회하기
postRouter.patch('/:id', authenticateUser, viewPost);

// 글 삭제하기
postRouter.delete('/:id', authenticateUser, deletePost);

// 글 수정하기
postRouter.patch('/:id', authenticateUser, uploadSome, checkPost, amendPost);

// 공감하기 / 공감취소
postRouter.patch('/:id/like', authenticateUser, patchLike);
postRouter.patch('/:id/unlike', authenticateUser, deleteLike);

// 댓글 작성하기 -> 에러 발생
postRouter.post('/:id/comment', authenticateUser, postComment);

export const homePostingRouter = express.Router();

homePostingRouter.get('/', getHomePosts);