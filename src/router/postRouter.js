import express from 'express';
import { checkFindPost, checkPosting } from '../middleware/postMiddleware.js';
import { viewPost, deletePost, amendPost, getHomePosts, viewRecommendPost, postNewPost } from '../controller/postController.js';
import { checkPost } from '../middleware/postMiddleware.js';
import { patchLike, deleteLike, postComment, viewComment } from '../controller/commentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { uploadSome } from "../middleware/imageMiddleware.js";

export const postRouter = express.Router();

// 게시판 조회하기
postRouter.get('/', authenticateUser, checkPosting);

// 글 작성하기
postRouter.post('/', authenticateUser, uploadSome, checkPost, postNewPost);

// 글 조회하기
postRouter.patch('/:id', authenticateUser, viewPost);
postRouter.get('/:id/comment', authenticateUser, viewComment);
postRouter.get('/:id/recommend', authenticateUser, viewRecommendPost);

// 글 삭제하기
postRouter.delete('/:id', authenticateUser, deletePost);

// 글 수정하기
postRouter.patch('/:id/amend', authenticateUser, uploadSome, checkPost, amendPost);

// 공감하기 / 공감취소
postRouter.patch('/:id/like', authenticateUser, patchLike);
postRouter.patch('/:id/unlike', authenticateUser, deleteLike);

// 댓글 작성하기
postRouter.post('/:id/comment', authenticateUser, postComment);

// 게시글, 작성자 검색하기
postRouter.get('/find', checkFindPost);


export const homePostingRouter = express.Router();

homePostingRouter.get('/', getHomePosts);