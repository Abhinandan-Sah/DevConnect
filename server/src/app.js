const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user");
const validator = require("validator");
// const {validateSignUpData, validateLoginData } = require("./utils/validation.js")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// app.post("/signup", async (req, res) => {
//     try {
//         // validate the data
//         validateSignUpData(req);

//         const {firstName, lastName, emailId,password}= req.body;

//         // Encrypt the password
//         const passwordHash = await bcrypt.hash(password, 10);

//         // creating a new instance of user model
//         const user = new User({
//             firstName,
//             lastName,
//             emailId,
//             password: passwordHash,
//         });
//         await user.save();
//         res.send("User Added Successfully!");
//     } catch (err) {
//         res.status(400).send('Error saving the user: ' + err.message);
//     }
// });

// app.post("/login", async (req, res) => {
//     try {
//         validateLoginData(req);

//         const {emailId, password} = req.body;

//         const user = await User.findOne({emailId: emailId});

//         if(!user){
//             throw new Error("Invalid credentials"); // Best practice for security say Invalid credentials
//         }

//         // Decrypt the password
//         // const isPasswordValid = await bcrypt.compare(password, user.password);
//         const isPasswordValid = await user.validatePassword(password);
//         if(isPasswordValid){
//             // Generate JWT Token
//             const token = await user.getJWT();

//             // Set the token in cookie
//             res.cookie("token", token, {expires: new Date(Date.now()+ 8 * 3600000)});

//             res.send("Login Successful");
//         }else{
//             throw new Error("Password is incorrect");
//         }

//     }catch(err){
//         res.status(400).send('Error in login: '+ err.message);
//     }
// });

// app.get("/profile", userAuth , async(req, res)=>{

//     try{
//         const user = req.user;
//         res.send(user)

//     }catch(err){
//         res.status(400).send("Error : "+err.message);
//     }

// });

app.get("/user", async (req, res) => {
  const userEmail = req.query.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("Error retrieving the user: " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const data = await User.find({});
    if (data.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(data);
    }
  } catch (err) {
    res.status(500).send("Error retrieving users: " + err.message);
  }
});

// DELETE  using delete request
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  // const user = await User.findByIdAndDelete({_id: userId});
  try {
    const user = await User.findByIdAndDelete(userId);
    if (user) {
      res.send("user deleted successfully");
    } else {
      res.status(404).send("No users found");
    }
  } catch (err) {
    res.status(500).send("Error retrieving users: " + err.message);
  }
});

// app.patch("/user/:userId", async(req, res)=>{
//     const userId = req.params?.userId;
//     const data= req.body;

//     const ALLOWED_UPDATES= [
//         "photoURL",
//         "gender",
//         "age",
//         "skills",
//     ];

//     try{
//         const isUpdateAllowed = Object.keys(data).every((k)=>
//             ALLOWED_UPDATES.includes(k)
//         )

//         if(!isUpdateAllowed){
//             throw new Error("update not allowed")
//         }

//         if(data?.skills.length>10){
//             throw new Error("skills cannot be more than 10");
//         }

//         const user= await User.findByIdAndUpdate({_id: userId}, data, {
//             returnDocument: "after",
//             runValidators: true,
//         });

//         if(user){
//             res.send("user record updated successfully");
//         }else{
//             res.send("user not found");
//         }
//     }catch(err){
//         res.status(500).send('Error retrieving users: ' + err.message)
//     }
// });

app.get("/", async (req, res) => {
  res.send("hello from server");
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });

app.listen(5000, () => {
  console.log("Server is running at port 6002");
});
