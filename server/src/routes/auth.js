const express = require("express");
const authRouter = express.Router();
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation.js");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user");
const redisClient = require("../config/redis.js");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth.js");

authRouter.post("/signup", async (req, res) => {
  try {
    // validate the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, skills, photoURL, about } =
      req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new instance of user model
    const user = new userModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      skills,
      photoURL,
      about,
    });
    const savedUser = await user.save();
    // Clear existing cookie (important)
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.SERVER_ENV === "production" ? "None" : "Lax",
      sameSite: "None",
    });
    // Generate JWT Token
    const token = await user.getJWT();

    // Set the token in cookie
    // res.cookie("token", token, {expires: new Date(Date.now()+ 8 * 3600000)});
    // Set the token in cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      sameSite: process.env.SERVER_ENV === "production" ? "None" : "Lax", // Allows sending cookies on top-level navigation GET requests
      secure: process.env.SERVER_ENV === "production", // only HTTPS in prod
      expires: new Date(Date.now() + 3600000), // 1 hours from now
    });
    res.json({ message: "User Added Successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req);

    const { emailId, password } = req.body;

    const user = await userModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials"); // Best practice for security say Invalid credentials
    }

    // Decrypt the password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: process.env.SERVER_ENV === "production" ? "None" : "Lax",
        secure: process.env.SERVER_ENV === "production",
      });

      // Generate JWT Token
      const token = await user.getJWT();

      // Set the token in cookie
      // res.cookie("token", token, {expires: new Date(Date.now()+ 8 * 3600000)});
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.SERVER_ENV === "production" ? "None" : "Lax",
        secure: process.env.SERVER_ENV === "production", // only HTTPS in prod
        expires: new Date(Date.now() + 3600000), // optional
      });

      // res.send("Login Successful");
      console.log("Login Successful");
      res.send(user);
    } else {
      throw new Error("Password is incorrect");
    }
  } catch (err) {
    res.status(400).send("Error in login: " + err.message);
  }
});

// authRouter.post("/logout", async(req, res)=>{
//     console.log("Logout")
//     res.cookie("token", null, {
//         expires: new Date(Date.now())
//     });
//     res.send("Logout Successfull!!");
// });
authRouter.post("/logout", userAuth, async (req, res) => {
  
  try{
    const { token } = req.cookies;
   if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

  const payload = jwt.decode(token);

  await redisClient.set(`token:${token}`, "Blocked");
  await redisClient.expire(`token:${token}`, payload.exp); // 1800 is second which is 30 minutes
  res.cookie("token", null, {
    httpOnly: true,
    sameSite: process.env.SERVER_ENV === "production" ? "None" : "Lax",
    secure: process.env.SERVER_ENV === "production", // only HTTPS in prod
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");

  }
  catch (err) {
    console.error("Error during logout:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = authRouter;
