const jwt=require("jsonwebtoken");
const { error, success } = require("./utils/responseWrapper");
const User=require("./models/user");
module.exports=async (req,res,next)=>{
     if(!req.headers||!req.headers.authorization|| !req.headers.authorization.startsWith("Bearer")){
        res.send(error(401,'Authorization header is required'));
        return;

     }
     const accessToken=req.headers.authorization.split(" ")[1];
     console.log(accessToken);
     try{
        const decoded=jwt.verify(accessToken,process.env.ACCESS_TOKEN_PRIVATE_KEY);
        req._id=decoded._id;
        const user=await User.findById(req._id);
        if(!user){
         return res.send(error(400,'user not found'))
        }
        next();


     }
    catch(err){
        console.log(err);
        res.send(error(401,err.message));
        return;


    }

}
