const Post = require("../models/Post");
const User = require("../models/user");
const { error, success } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/utils");
const cloudinary=require("cloudinary").v2;

//for create Post
const createPost=async (req,res)=>{
    try{
        
    const {caption,postImg}=req.body;
    const owner=req._id;

    if(!caption||!postImg){

        return res.send(error(400,'Caption and postImage both are required'));
    }
    

    const cloudImg=await cloudinary.uploader.upload(postImg,{
            folder:'PostImg'
        });
    

      
        
            
        
    

    const user=await User.findById(owner);
    
    
    const post= await Post.create({
        owner,
        caption,
        image:{
            publicId:cloudImg.public_id,
             url:cloudImg.url
        },
    })
    
    user.posts.push(post._id);
    await user.save();
    return res.send(success(201,"post created"));

}catch(err){
    res.send(error(500,err.message))
}


}
//for like and unlike
const  likeAndUnlikePost=async (req,res)=>{
    try{
        const {postId}=req.body;
        const currUserId=req._id;
        const post=await Post.findById(postId).populate('owner');
        if(!post){
            return res.send(error(404,'Post not found'))
        }
      //if not liked,like it
      if(post.likes.includes(currUserId)){
        const index=post.likes.indexOf(currUserId);
        post.likes.splice(index,1);
        

        }
        else{
            post.likes.push(currUserId);
            
        }
        await post.save();
        return res.send(success(200,{post:mapPostOutput(post,req._id)}));
}
    catch(err){
        res.send(error(500,err.message))


    }
   

  }
const UpdatePostController=async (req,res)=>{
    try{
        const {postId,caption}=req.body;
    const currUserId=req._id;

    const post=await Post.findById(postId);
    if(!post){
        return res.send(error(404,'Post not found'))
    }

     if(post.owner.toString()!==currUserId){
        return res.send(error(403,'Only owners can update their post'))

     }
        if(caption){
            post.caption=caption;
        }
        await post.save();
        return res.send(success(200,post))
    }
    catch(err){
        res.send(error(500,err.message))


    }

}
const DeletePostController=async (req,res)=>{
    try{

        const {postId}=req.body;
    const currUserId=req._id;
    const post=await Post.findById(postId);
    if(!post){
        return res.send(error(404,'post not found'))
    }
    if(post.owner.toString()!=currUserId){
        return res.send(error(403,'you cannot delete that post'));
    }
    const currUser=await User.findById(currUserId);
        const index=currUser.posts.indexOf(post._id);
        currUser.posts.splice(index,1);
        await currUser.save();
        await post.remove();
        return res.send(success(200,'post deleted'));

 
    }
    catch(err){

        res.send(error(500,err.message))
    }cd 

}

module.exports={createPost,likeAndUnlikePost,UpdatePostController,DeletePostController}