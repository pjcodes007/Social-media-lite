import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    comment : {
        type:String,
        required:false,    
    },
    userID : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    photoID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Photo'
    }


},{timestamps:true});

const Comment = mongoose.model('Comment',commentSchema);
export default Comment;