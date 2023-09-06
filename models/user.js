const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
   email:{
       type:String,
       required:true,
       unique:true,
       lowercase:true
   },

   password:{
       type:String,
       required:true
   },
   name:{
    type:String,
    required:true
   },
   bio:{
    type:String

   },
   avatar:{
    publicId:{
        type:String,
        default:'ProfileImg/user_yury6n'
    },
    url:{
        type:String,
        default:'https://res.cloudinary.com/de8cqi7gx/image/upload/v1693804010/ProfileImg/user_yury6n.png'

    }
   },
   followers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }


   ],
   followings:[
    {
        
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
   ],
   posts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
   ]
},{
    timestamps:true
    //it add two field created at or updated at
})
module.exports=mongoose.model("user",userSchema);