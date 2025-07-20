import Photo from "../models/photo.model.js";

// Upload a new photo
export const uploadPhoto = async (req, res) => {
  try {
    const {
      caption,
      tags,
      categories,
      exifData,
      privacy,
      isFeatured,
      isForSale,
      price,
      licensingOptions
    } = req.body;

    // File upload handling assumed via middleware like Multer
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload required" });
    }

    const photo = await Photo.create({
      author: req.user.id,
      image: req.file.path, // Adjust as needed for your storage setup
      caption,
      tags,
      categories,
      exifData,
      privacy,
      isFeatured,
      isForSale,
      price,
      licensingOptions
    });

    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ message: "Photo upload failed", error: err.message });
  }
};

// Get a single photo by ID
export const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate("author", "username avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" }
      });
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    res.json(photo);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID", error: err.message });
  }
};

// Get all photos (feed/discovery)
export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ privacy: "public" })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar");
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: "Fetching photos failed", error: err.message });
  }
};

// Edit a photo (only by author)
export const updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    if (photo.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    Object.assign(photo, req.body);
    await photo.save();
    res.json({ message: "Photo updated", photo });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Delete a photo (only by author)
export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    if (photo.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await photo.deleteOne();
    res.json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
};
