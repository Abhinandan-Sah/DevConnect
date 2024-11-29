const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require: true
    },
    lastName:{
        type: String,
    }, 
    emailId: {
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    age:{
        type: Number,
    },
    gender:{
        type: String,
    }
})

 const userModel =  mongoose.model("User", userSchema);

module.exports= userModel;