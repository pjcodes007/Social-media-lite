import Like from '../models/like.model.js';


export const likePhoto = async (req, res) => {
    try {
        const { photoID } = req.params;

        const newLike = new Like({
            userId: req.user.id,
            photoId: photoID
        });

        await newLike.save();
        res.status(201).json({ message: '✅ Photo liked' });

    } catch (err) {
        if (err.code === 11000) {
            // Duplicate like
            return res.status(400).json({ message: '❌ You have already liked this photo.' });
        }
        res.status(500).json({ message: '❌ Could not like photo', error: err.message });
    }
};

export const unlikePhoto = async (req, res) => {
    try {
        const { photoID } = req.params;

        const like = await Like.findOneAndDelete({
            userId: req.user.id,
            photoId: photoID
        });

        if (!like) {
            return res.status(404).json({ message: '❌ You haven’t liked this photo yet.' });
        }

        res.json({ message: '✅ Photo unliked' });

    } catch (err) {
        res.status(500).json({ message: '❌ Could not unlike photo', error: err.message });
    }
};

export const getPhotoLikes = async (req, res) => {
    try {
        const { photoID } = req.params;

        const count = await Like.countDocuments({ photoId: photoID });

        res.json({ photoId: photoID, likes: count });

    } catch (err) {
        res.status(500).json({ message: '❌ Could not fetch likes', error: err.message });
    }
};
