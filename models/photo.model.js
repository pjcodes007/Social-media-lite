import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  caption: String,
  tags: [String],
  categories: [String],
  exifData: Object,
  privacy: { type: String, default: 'public' },
  isFeatured: { type: Boolean, default: false },
  isForSale: { type: Boolean, default: false },
  price: Number,
  licensingOptions: Object
}, { timestamps: true });

export default mongoose.model('Photo', photoSchema);
