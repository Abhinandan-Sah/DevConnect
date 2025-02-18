const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const requestRouter= express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(requestRouter, res)=>{{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)){
            // throw new Error("Invalid Status");
            return res.status(400).json({message: "Invalid status type: "+ status})
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({message: "Connection Request Sent Successfully!", data})
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }

    res.send(user.firstName + "sent the connect request!");
}});

module.exports = requestRouter;