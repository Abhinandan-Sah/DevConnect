const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter= express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async(requestRouter, res)=>{{
    const user = req.user;
    // Sending a connection request
    console.log("Sending a connection request");

    res.send(user.firstName + "sent the connect request!");
}});

module.exports = requestRouter;