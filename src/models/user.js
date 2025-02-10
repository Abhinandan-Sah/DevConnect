const mongoose = require("mongoose");

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
      unique: true
    },
    password: {
      type: String,
      require: true,
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
