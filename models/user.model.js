import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    
    email :{
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    avatar: {
        type:String,
        required: false
    },

    dob: {
        type:Date,
        required:true
    },

    access:{
        type:String,
        enum:['public' , 'private'],
        default:'public'
    },

    bio: {
        type:String,
        required:false,
        trim:true
    },

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{timestamps:true});
const User = mongoose.model('User',userSchema);

export default User;