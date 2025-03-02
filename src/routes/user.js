const express = require("express");
const authRouter = require("./auth");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "_id firstName lastName photoURL age gender about skills";

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        // const connectionRequests = await ConnectionRequestModel.find({
        //     $or: [
        //         { toUserId: loggedInUser._id, status: "accepted"},
        //         { fromUserId: loggedInUser._id, status:"accepted" },
        //     ]
        // })
        // const connectionRequests = await ConnectionRequestModel.find({
        //     $or: [
        //         { fromUserId: loggedInUser._id, status:"accepted" },
        //         { toUserId: loggedInUser._id, status: "accepted"},
        //     ]
        // }).populate("fromUserId", USER_SAFE_DATA);


        // const getUserConnections = (connectionRequests, loggedInUser) => {
        //     return connectionRequests
        //         .map(row => row.fromUserId._id.toString()) // Extract _id as a string
        //         .filter(userId => userId !== loggedInUser._id.toString()); // Filter matching _id
        // };
        
        // // Example usage:
        // const data = getUserConnections(connectionRequests, loggedInUser);
        // res.json({data: data});


        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", USER_SAFE_DATA);
        
        const getUserConnections = (connectionRequests, loggedInUser) => {
            return connectionRequests.map(row => {
                // Return the user who is NOT the logged-in user
                return row.fromUserId._id.toString() === loggedInUser._id.toString()
                    ? row.toUserId // If `fromUserId` is logged in user, return `toUserId`
                    : row.fromUserId; // Else, return `fromUserId`
            });
        };
        
        // Example usage:
        const data = getUserConnections(connectionRequests, loggedInUser);
        res.json({ data: data });
        
    }
    catch(err){
        res.status(400).send({message: err.message});
    }
})

// Feed Api/router
userRouter.get("/feed", userAuth, (req, res) => {
    
})

module.exports = userRouter;