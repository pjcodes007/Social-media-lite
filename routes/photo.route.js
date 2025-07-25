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

const router = express.Router();

// 📤 Upload a photo (Protected Route)
router.post('/', verifyToken, upload.single('image'), uploadPhoto);

// 📄 Get a single photo by ID
router.get('/:id', getPhotoById);

// 🖼️ Get all public photos
router.get('/', getAllPhotos);

// ✏️ Update a photo (Protected Route)
router.put('/:id', verifyToken, updatePhoto);

// ❌ Delete a photo (Protected Route)
router.delete('/:id', verifyToken, deletePhoto);

// 🔄 ✅ New route to update photo layout (bulk update)
router.put('/layout/update', verifyToken, updatePhotoLayout);

export default router;
