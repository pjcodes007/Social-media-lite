import Comment from '../models/comment.model.js'
export const addComment = async(req,res)=>{

    try{
        const {comment} = req.body;
        const {photoID} = req.params;
        const newComment = new Comment({
            photoID,
            userID:req.user.id,
            comment
        })
    
        newComment.save();
        return res.status(201).json({message:'✅Comment Added' , comment});
    }

    catch(err){
        return res.status(401).json({message:'❌Comment could not be added ',error:err.message})
    }

}

export const getComment = async (req,res)=>{
    try{
        const {photoID} = req.params;
        const comments = await Comment.find({photoID}).populate('userID','username');
        res.json(comments);
    
    }
    catch(err){
        return res.status(401).json({message:'❌Could not retrieve messages',error:err.message});
    }
}

export const deleteComment = async(req,res)=>{
    try{
        const {commentId} = req.params;
        const comment = await Comment.findById(commentId);
        
        await comment.deleteOne();
        res.json({message:'Comment deleted'});
    }
    catch(err){
        return res.status(401).json({message:'❌Comment could not be deleted',error:err.messsage})
    }
}

export const getNumberOfComments = async(req,res)=>{
    try{

        const{photoId} = req.params;
    
        const count = await Comment.countDocuments({photoId});
        res.json({photoId:photoId,comments:count});
    }
    catch(err){
        return res.status(401).json({message:'❌Could not find comments',error:err.message});
    }
}