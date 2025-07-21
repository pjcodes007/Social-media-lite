import express from 'express';
import { likePhoto, unlikePhoto, getPhotoLikes } from '../controllers/like.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js';

const likeRouter = express.Router();

likeRouter.post('/:photoID/like', verifyToken, likePhoto);
likeRouter.post('/:photoID/unlike', verifyToken, unlikePhoto);
likeRouter.get('/:photoID', getPhotoLikes);

export default likeRouter;
