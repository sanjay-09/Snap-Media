const router=require("express").Router();
const requireUser=require("../requireUser")
const userController=require("../Controllers/userController");



router.post("/followOrUnfollowUser",requireUser,userController.followOrUnfollowUser);
router.get("/getFeedData",requireUser,userController.getPostsOfFollowing);
router.get("/getMyPost",requireUser,userController.getMyPost);
router.get("/getUserPost",requireUser,userController.getUserPosts);
router.delete("/",requireUser,userController.deleteMyProfile);
router.get("/getMyInfo",requireUser,userController.getMyInfo);
router.put("/",requireUser,userController.updateUser);
router.post('/getUserProfile',requireUser,userController.getUserProfile); 



module.exports=router;