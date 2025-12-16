const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    //passport-local-mongoose automatically ads username, hashed password and salt
})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User', userSchema);