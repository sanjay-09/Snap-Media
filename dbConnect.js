const mongoose=require("mongoose");
const url="mongodb+srv://sanjuwatson0110:UnyCl6pZujy4htAC@cluster1.chpu5ky.mongodb.net/?retryWrites=true&w=majority";
module.exports=()=>{
    mongoose.connect(url).then(()=>{  
    console.log("Connected succesfully")
})
.catch((err)=>{
    console.log(err);
    process.exit(1);

})
};