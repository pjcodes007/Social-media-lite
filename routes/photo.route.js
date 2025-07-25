import express from 'express';
import upload from '../middlewares/multer.middleware.js';        // Multer middleware
import {
  uploadPhoto,
  getPhotoById,
  getAllPhotos,
  updatePhoto,
  deletePhoto,
  updatePhotoLayout     // ✅ Import the new controller
} from '../controllers/photo.controller.js';

import { verifyToken } from '../middlewares/jwt.middleware.js';   // Example auth middleware

const photoRouter = express.Router();

// 📤 Upload a photo (Protected Route)
photoRouter.post('/', verifyToken, upload.single('image'), uploadPhoto);

// 📄 Get a single photo by ID
photoRouter.get('/:id', getPhotoById);

// 🖼️ Get all public photos
photoRouter.get('/', getAllPhotos);

// ✏️ Update a photo (Protected Route)
photoRouter.put('/:id', verifyToken, updatePhoto);

// ❌ Delete a photo (Protected Route)
photoRouter.delete('/:id', verifyToken, deletePhoto);

// 🔄 ✅ New route to update photo layout (bulk update)
photoRouter.put('/layout/update', verifyToken, updatePhotoLayout);

export default photoRouter;
