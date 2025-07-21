import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo',
        required: true
    }
}, { timestamps: true });

likeSchema.index({ userId: 1, photoId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;
