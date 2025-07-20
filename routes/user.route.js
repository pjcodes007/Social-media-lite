import express from 'express';

import {signUp,
    Login,
    updateUserProfile,
    getUserProfile,
    followUserByUsername,
    unfollowUserByUsername} from '../controllers/user.controller.js';

import { verifyToken } from '../middlewares/jwt.middleware.js';


const profileRouter = express.Router();

//Login and Signup
profileRouter.post('/signup',signUp);
profileRouter.post('/login',Login);


//Get user
profileRouter.get('/:id',verifyToken,getUserProfile);

//Update Profile
profileRouter.put("/profile", verifyToken, updateUserProfile);

//Follow Unfollow
profileRouter.post("/follow/:username", verifyToken, followUserByUsername);     
profileRouter.post("/unfollow/:username", verifyToken, unfollowUserByUsername); 


export default profileRouter;