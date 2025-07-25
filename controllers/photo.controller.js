import fs from 'fs';
import exifParser from 'exif-parser';
import Photo from '../models/photo.model.js';
import { uploadToCloudinary} from '../middlewares/cloudinary.middleware.js'

/**
 * Upload a new photo
 */
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Uploaded file must be an image' });
    }

    const buffer = fs.readFileSync(req.file.path);
    const parser = exifParser.create(buffer);
    const exif = parser.parse();

    const exifData = {
      camera: exif.tags.Make && exif.tags.Model ? `${exif.tags.Make} ${exif.tags.Model}` : undefined,
      lens: exif.tags.LensModel,
      exposure: exif.tags.ExposureTime,
      aperture: exif.tags.FNumber,
      focalLength: exif.tags.FocalLength,
      iso: exif.tags.ISO
    };

    const uploadResult = await uploadToCloudinary(req.file.path, 'gallery_images');
    fs.unlinkSync(req.file.path);

    const photo = await Photo.create({
      author: req.user.id,
      image: uploadResult.secure_url,
      caption: req.body.caption,
      tags: Array.isArray(req.body.tags)
        ? req.body.tags
        : typeof req.body.tags === 'string'
        ? req.body.tags.split(',').map(t => t.trim())
        : [],
      categories: Array.isArray(req.body.categories)
        ? req.body.categories
        : typeof req.body.categories === 'string'
        ? req.body.categories.split(',').map(c => c.trim())
        : [],
      exifData,
      privacy: req.body.privacy || 'public',
      isFeatured: req.body.isFeatured || false,
      isForSale: req.body.isForSale || false,
      price: req.body.price || 0,
      licensingOptions: typeof req.body.licensingOptions === 'string'
        ? JSON.parse(req.body.licensingOptions)
        : req.body.licensingOptions || {},
      x: req.body.x || 0,
      y: req.body.y || 0,
      width: req.body.width || 300,
      height: req.body.height || 300,
    });

    res.status(201).json(photo);

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: 'Photo upload failed', error: error.message });
  }
};


/**
 * Get a single photo by ID
 */
export const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('author', 'username avatar');

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.json(photo);

  } catch (error) {
    res.status(400).json({ message: 'Invalid photo ID', error: error.message });
  }
};

/**
 * Get all public photos (feed/discovery)
 */
export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ privacy: 'public' })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar');

    res.json(photos);

  } catch (error) {
    res.status(500).json({ message: 'Fetching photos failed', error: error.message });
  }
};

/**
 * Update a photo (author-only)
 */
export const updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this photo' });
    }

    Object.assign(photo, req.body);

    await photo.save();

    res.json({ message: 'Photo updated successfully', photo });

  } catch (error) {
    res.status(500).json({ message: 'Photo update failed', error: error.message });
  }
};

/**
 * Delete a photo (author-only)
 */
export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this photo' });
    }

    await photo.deleteOne();

    res.json({ message: 'Photo deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Photo deletion failed', error: error.message });
  }
};
