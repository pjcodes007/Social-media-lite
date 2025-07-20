import express from "express";
import { 
  uploadPhoto,
  getPhotoById,
  getAllPhotos,
  updatePhoto,
  deletePhoto
} from "../controllers/photo.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const photoRouter = express.Router();

// Upload a new photo (protected)
photoRouter.post(
  "/", 
  verifyToken, 
  upload.single("image"), 
  uploadPhoto
);

// Get all public photos (feed/discovery)
photoRouter.get("/", getAllPhotos);

// Get details of a single photo
photoRouter.get("/:id", getPhotoById);

// Update a photo (only author, protected)
photoRouter.put(
  "/:id", 
  verifyToken, 
  updatePhoto
);

// Delete a photo (only author, protected)
photoRouter.delete(
  "/:id", 
  verifyToken, 
  deletePhoto
);

export default photoRouter;
