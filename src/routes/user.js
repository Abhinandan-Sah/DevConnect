const express = require("express");
const authRouter = require("./auth");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");
const userRouter = express.Router();

// get all the pending connection request for the loggedIn user
userRouter.get("/user/request/received", userAuth, async (req, res)=>{
    try{
        const loggedInUser= req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]);
        res.send({message: "Data fetched successfully", data: connectionRequests});
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
});

module.exports = userRouter;