 const User=require("../models/user");
 const bcrypt=require("bcrypt");
 const jwt=require('jsonwebtoken');
const { error, success } = require("../utils/responseWrapper");
 
 const signupController=async (req,res)=>{
    try{
          
          const{name,email,password}=req.body;
          
          if(!email||!password||!name){
        
            // res.status(400).send('all fields are required');
           return  res.send(error(400,'all field are required'));
             
          } 
        const oldUser=await User.findOne({email});
        if(oldUser){
            // res.send(409).send("User is already registered");
            res.send(error(409,'User is already registered'));
            return;

        }
        
        
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        }
        )
      return  res.send(success(302,'user created successfully'))
         

    }
    catch(err){
       return res.send((error(500,err.message)));
    }


 }
 const loginController=async (req,res)=>{
    try{

        const{email,password}=req.body;
       
        if(!email||!password){
            res.send(error(400,'all field are required'));
            return;
        }
        const exisitngUser=await User.findOne({email});
        if(!exisitngUser){
            res.send(error(404,'User not Found'));
            return;

        }
        const matched=await bcrypt.compare(password,exisitngUser.password);
        if(!matched){
            res.send(error(403,'Incorrect Password'));
            return;
        }
        
        const accessToken=generateAccessToken({
            _id:exisitngUser._id,
            email:exisitngUser.email 
        });
        const refreshToken=generateRefreshToken({
            _id:exisitngUser._id,
            email:exisitngUser.email
        })
        res.cookie('jwt',refreshToken,{
            
            secured:true

        });
        return  res.send(success(201,{
            accessToken
        }))
        


    }
    catch(err){
    return res.send(error(500,err.message));
        
    }


 }
 //this api will check the refreshToekn validitt and generate a new token
 const refreshAccessTokenController= async (req,res)=>{
    const cookies=req.cookies;
    if(!cookies.jwt){
        res.send(error(401,'refresh token in cookie is required'));
             return;
    }
    const refreshToken=cookies.jwt;
    if(!refreshToken){
        res.send(error(401,'refresh token is required'));
             return;
    }

    try{
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id=decoded._id;
        const email=decoded.email;
        const accessToken=generateAccessToken({
            _id,
            email
        })        
        return  res.send(success(201,{
            accessToken
        }))

     }
    catch(error){
        
        return res.status(401).send("Invalid Access Key");



    }
    

 }
 //internal  functinon
 const generateAccessToken=(data)=>{
    try{
    return jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{
        expiresIn:'30m'
    });  
}
catch(err){
    return res.send(error(500,err.message))
}  
 }
 const generateRefreshToken=(data)=>{
    try{
    return jwt.sign(data,process.env.REFRESH_TOKEN_PRIVATE_KEY,{
        expiresIn:'1y'
    }); 

} 
    
    catch(err){
        return res.send(error(500,res.err));
    }
 }
 

 const logoutController=async (req,res)=>{
    try{
        res.clearCookie('jwt',{
            httpOnly:true, //it specify it cannot be accessed by javascript code
            secure:true
        })
        return res.send(success(200,'user logged out'));

    }
    catch(err){
        return res.send(error(500,err.message));
    }
     
 }
 module.exports={signupController,loginController,refreshAccessTokenController,logoutController}