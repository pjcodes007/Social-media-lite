import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB(){
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI );
        console.log('✅Database Connection Succesfful ')
    }
    catch(err){
        console.log('❌Connection unsuccesful ',err);
    }
}

