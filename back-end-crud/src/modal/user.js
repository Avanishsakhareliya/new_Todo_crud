const mongoose=require("mongoose");

const struct =mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    token:String
})
const result=mongoose.model("user",struct)
module.exports=result