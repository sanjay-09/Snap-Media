const Post = require("../models/Post");
const User = require("../models/user");
const { error, success } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/utils");
const cloudinary=require("cloudinary").v2;
const followOrUnfollowUser=async (req,res)=>{
    try{
        const {userIdToFollow}=req.body;
    
    const curUserId=req._id;
    const userToFollow=await User.findById(userIdToFollow);
    const curUser=await User.findById(curUserId); 
    if(userIdToFollow==curUserId){
        return res.send(error(401,'Cannot follow yourself'))
    }   
    if(!userToFollow||!curUserId){
        return res.send(error(404,'User not found'))
    }
    if(curUser.followings.includes(userIdToFollow)){
        
        const followingIndex=curUser.followings.indexOf(userIdToFollow); 
        const followerIndex=userToFollow.followers.indexOf(curUserId);
        curUser.followings.splice(followingIndex,1);
        userToFollow.followers.splice(followerIndex,1);

        

    }
    else{
        
        curUser.followings.push(userIdToFollow);
        userToFollow.followers.push(curUserId);
    }
        await curUser.save();
        await userToFollow.save();
        return res.send(success(200,{user:userToFollow}))

    }
    catch(err){
        return res.send(error(501,err.message));

    }
    
}
const getPostsOfFollowing=async (req,res)=>{
   try{
    const curUserId=req._id;
    const currUser=await User.findById(curUserId).populate('followings');

    const fullPosts=await Post.find({
        'owner':{
            $in:currUser.followings
        }
    }).populate('owner');
    

    const posts=fullPosts.map((item)=>mapPostOutput(item,req._id)).reverse();
    const nobj={...currUser._doc,posts};

    const followingsIds=currUser.followings.map(item=>item.id);
    followingsIds.push(curUserId);
    const suggestions=await User.find({
        _id:{
            $nin:followingsIds
        }
    })
    
      

    return res.send(success(200,{...nobj,suggestions}));

   }

   catch(err){
    
    return res.send(error(500,err.message));

   }

}
const getMyPost=async (req,res)=>{
   try{
    const currUserId=req._id;
    const allUserPost=await Post.find({
        owner:currUserId
    }).populate('likes');
    return res.send(success(200,{allUserPost}))
   }
    
  catch(err){
    return res.send(error(500,e.message));

  }
}
const getUserPosts=async (req,res)=>{
    try{
    const{userId}=req.body;
    if(!userId){
        return res.send(error(400,'UserId is required'))
    }

    const userPosts=await Post.find({
          owner:userId
    }).populate('likes');
    return res.send(success(200,{userPosts}))

    }
    catch(err){
        
        return res.send(error(500,e.message));
        
    }
}
const deleteMyProfile=async (req,res)=>{
    try{
        const curUserId=req._id;
    const curuser=await User.findById(curUserId);
    //delete all posts
    Post.deleteMany({
        owner:curUserId
    })
    //followeres ki following ki list delete kar do
    curuser.followers.forEach( async(followerId)=>{
        const follower=await User.findById(followerId);
        const index=follower.following.indexOf(curUserId);
        follower.following.splice(index,1);
        await follower.save();
         

    })
    //following ke follower ki list se delete kar do
    curuser.following.forEach(async(followingId)=>{
        const following=await User.find(followingId);
        const index=following.follower.indexOf(curUserId);
        following.follower.splice(index,1);
        await following.save();
    })
    //remove myself from all likes
    const allPosts=await Post.find();
    allPosts.forEach(async (post)=>{
        const index=post.likes.indexOf(curUserId);
        post.likes.splice(index,1);
        await post.save();

    })
    await curUserId.remove();
    res.clearCookie('jwt',{
        httpOnly:true
    })
    return res.send(success(200,'user deleted'))

    }
    catch(err){
        return res.send(error(404,err.message));

    }
}

const getMyInfo=async (req,res)=>{
    try{
        const user=await User.findById(req._id);
    
        return res.send(success(202,{user}))
    }
     catch(err){
        return res.send(error(401,err.message));

     }



}
const updateUser=async (req,res)=>{
    try{
        const{name,bio,userImg}=req.body;
      

         
        const user=await User.findById(req._id);
        
        if(name){
            user.name=name;
        }
        if(bio){
            user.bio=bio;

        }
        if(userImg){
    
            const cloudImg=await cloudinary.uploader.upload(userImg,{
                folder:'profileImg'
            })

            
            user.avatar={
                url:cloudImg.secure_url,
                publicId:cloudImg.public_id
            }

        }
            await user.save();

        
        return res.send(success(202,{user}))
    }
     catch(err){
        return res.send(error(401,err.message));

     }



}

const getUserProfile=async (req,res)=>{
    try{
        const {userId}=req.body;
        
    const user=await User.findById(userId).populate(
        {
            path:'posts',
            populate:{
                path:'owner'
            }
        }
    );
    
    const fullPosts=user.posts;
    const posts=fullPosts.map(items=>mapPostOutput(items,req._id)).reverse();


    
    

    
    return res.send(success(200,{...user._doc,posts}))



    }
    catch(err){
        return res.send(error(404,err.message))
    }
}

 
module.exports={followOrUnfollowUser,getPostsOfFollowing,getMyPost,getUserPosts,deleteMyProfile,getMyInfo,updateUser,getUserProfile};