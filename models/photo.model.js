import mongoose from "mongoose";

const exifSchema = new mongoose.Schema(
  {
    camera: String,
    lens: String,
    exposure: String,
    aperture: String,
    focalLength: String,
    iso: String,
  },
  { _id: false }
);

const photoSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String, required: true }, 
    tags: [{ type: String, lowercase: true, trim: true }],
    categories: [{ type: String, lowercase: true, trim: true }],
    exifData: exifSchema,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    privacy: {
      type: String,
      enum: ["public", "followers", "private"],
      default: "public",
    },
    isFeatured: { type: Boolean, default: false },
    editingHistory: [{ type: String }],
    isForSale: { type: Boolean, default: false },
    price: { type: Number },
    licensingOptions: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Photo", photoSchema);
