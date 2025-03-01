const express = require("express");
const authRouter = require("./auth");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills";

// get all the pending connection request for the loggedIn user
userRouter.get("/user/request/received", userAuth, async (req, res)=>{
    try{
        const loggedInUser= req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        res.send({message: "Data fetched successfully", data: connectionRequests});
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
});

userRouter. get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequestions = ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser, status:"accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({data: connectionRequestions})
    }
    catch(err){
        res.status(400).send({message: err.message});
    }
})

module.exports = userRouter;