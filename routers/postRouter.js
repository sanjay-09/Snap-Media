const router=require("express").Router();
const {createPost}=require("../Controllers/PostController");
const {likeAndUnlikePost}=require("../Controllers/PostController");
const {UpdatePostController}=require("../Controllers/PostController");
const {DeletePostController}=require("../Controllers/PostController");
const requireUser=require("../requireUser")

router.post("/createPost",requireUser,createPost);
router.post("/like",requireUser,likeAndUnlikePost);
router.put('/',requireUser,UpdatePostController);
router.post('/deletePost',requireUser,DeletePostController);



module.exports=router;