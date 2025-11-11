require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user");
const validator = require("validator");
// const {validateSignUpData, validateLoginData } = require("./utils/validation.js")
const bcrypt = require("bcryptjs");
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
const redisClient = require("./config/redis.js");
const rateLimiter = require("./middlewares/rateLimiter.js");

const port = process.env.SERVER_PORT;

// app.use(cors({
//     origin: process.env.SERVER_ENV === 'production'
//       ? [
//           'http://devconnects.tech',
//           'https://devconnects.tech',
//           'http://www.devconnects.tech',
//           'https://www.devconnects.tech',
//           'http://20.244.50.103:5173',
//           'http://20.244.50.103',
//           'http://20.244.45.66:5173',
//           'http://20.244.45.66',
//         ]
//       : 'http://localhost:5173',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//     exposedHeaders: ['Set-Cookie']
// }));

// Allow all origins
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter)

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);
// app.use("/", chatRouter);

// Mount all API routes under /api prefix
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);


app.get("/", async (req, res) => {
  res.send("hello from server");
});

// Health check endpoints for Nagios monitoring
app.get("/api/health", async (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

app.get("/api/health/mongodb", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState === 1) {
      res.status(200).json({ status: "ok", message: "MongoDB is connected" });
    } else {
      res.status(503).json({ status: "error", message: "MongoDB is not connected" });
    }
  } catch (error) {
    res.status(503).json({ status: "error", message: "MongoDB health check failed", error: error.message });
  }
});

app.get("/api/health/redis", async (req, res) => {
  try {
    if (redisClient.isOpen && redisClient.isReady) {
      await redisClient.ping();
      res.status(200).json({ status: "ok", message: "Redis is connected" });
    } else {
      res.status(503).json({ status: "error", message: "Redis is not connected" });
    }
  } catch (error) {
    res.status(503).json({ status: "error", message: "Redis health check failed", error: error.message });
  }
});

const server = http.createServer(app);
initilizeSocket(server);

const initilizeConnection = async() => {
  try{
    await Promise.all([redisClient.connect(), connectDB()]);
    console.log("Database connected successfully along with redis")

    server.listen(port, (req, res) => {
      console.log("Server is running at port " + port);
    });

  }
  catch(err){
    console.log("Error: "+ err);
  }
}

initilizeConnection();

