const { required } = require("joi");
const mongoose=require("mongoose");
const PassportLocalMongoose=require("passport-local-mongoose");
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})
userSchema.plugin(PassportLocalMongoose);//yr username,pASSWARD,HASHING,SALTING DEFAULT ME LE AAYEGA
module.exports=mongoose.model("user",userSchema);