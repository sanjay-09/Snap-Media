const express=require("express");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const dbConnect=require("./dbConnect");
const authRouter=require("./routers/authRouter");

const postRouter=require("./routers/postRouter");
const userRouter=require("./routers/userRouter");


dotenv.config({path:'./.env'})
const app=express();
const morgan=require("morgan");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const cloudinary=require("cloudinary").v2;



cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SR 
  });
  



//middlewares
app.use(express.urlencoded({ extended: true }));
  
app.use(express.json({limit:'10mb'}));
app.use(morgan('common'))
app.use(cookieParser());
app.use(cors({
    credentials:true,
    
    origin:'http://localhost:3000'
}));




app.use('/auth',authRouter);
app.use("/posts",postRouter);
app.use("/user",userRouter)
app.get("/",(req,res)=>{
    res.status(200).send("ok from server");
})

dbConnect();



app.listen(PORT,(req,res)=>{
    console.log("listening on",PORT);
})
