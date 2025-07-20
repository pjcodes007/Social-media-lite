import jwt from 'jsonwebtoken';


export async function verifyToken(req,res,next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return res.status(401).json({message : "No token Provided ❌"});
    }
    try{
        let decode = jwt.verify(token,process.env.JWT_SECRET);
        if(decode){
            console.log(decode)
            req.user = decode;
            next();
        }
    }
    catch(err){
        return res.status(401).json({message : "Incorrect Token ❌",err});
    }
}
