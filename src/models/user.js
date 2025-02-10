const mongoose = require("mongoose");
const validator= require("validator")


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 60,
    },
    lastName: {
      type: String,
    },

    emailId: {
      type: String,
      lowercase: true,
      require: true,
      trim: true,
      unique: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid Email address "+value);
        }
      }
    },
    password: {
      type: String,
      require: true,
      validator(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Enter a Strong Password: "+ value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    skills: {
      type: [String],
    },
    photoURL: {
      type: String,
      validate(value){
        if(!validator.isURL(value)){
          throw new Error ("Invalid photo Url "+ value)
        }
      },
      default: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
    },
    createdAt:{
        type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
