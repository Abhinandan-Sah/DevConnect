require("dotenv").config();
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
require("./utils/cronjob.js");
const http = require("http");
const initilizeSocket = require("./utils/socket.js");
const chatRouter = require("./routes/chat.js");

const port = process.env.PORT;

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
app.use("/", chatRouter);

// app.get("/user", async (req, res) => {
//   const userEmail = req.query.emailId;
//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if (!user) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(500).send("Error retrieving the user: " + err.message);
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const data = await User.find({});
//     if (data.length === 0) {
//       res.status(404).send("No users found");
//     } else {
//       res.send(data);
//     }
//   } catch (err) {
//     res.status(500).send("Error retrieving users: " + err.message);
//   }
// });

// // DELETE  using delete request
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   // const user = await User.findByIdAndDelete({_id: userId});
//   try {
//     const user = await User.findByIdAndDelete(userId);
//     if (user) {
//       res.send("user deleted successfully");
//     } else {
//       res.status(404).send("No users found");
//     }
//   } catch (err) {
//     res.status(500).send("Error retrieving users: " + err.message);
//   }
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

const server = http.createServer(app);
initilizeSocket(server);

server.listen(port, (req, res) => {
  console.log("Server is running at port " + port);
});
