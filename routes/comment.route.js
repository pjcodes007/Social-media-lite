import express from 'express';
import { addComment,getComment,deleteComment,getNumberOfComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../middlewares/jwt.middleware.js';

const commentRouter = express.Router();

commentRouter.post('/:photoID',verifyToken,addComment);
commentRouter.get('/:photoID',verifyToken,getComment);
commentRouter.delete('/:commentId',verifyToken,deleteComment);
commentRouter.get('/noofcom/:photoID',verifyToken,getNumberOfComments);


export default commentRouter;