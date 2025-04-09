const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const {subDays, endOfDay, startOfDay} = require("date-fns");
const sendEmail = require("./sendEmail.js");

cron.schedule("40 03 17 * * *", async() => {
    // Send emails to all people who got requests the previous day
    try{
        console.log("hello")
        const yesterday = subDays(new Date(), 1);
        
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        console.log("by")
        const pendingRequestsOfYesterday = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }
        }).populate("fromUserId toUserId"); 
        console.log(pendingRequestsOfYesterday)
        const listOfEmails = [...new Set(pendingRequestsOfYesterday.map(req=> req.toUserId.emailId))]

        console.log(listOfEmails)
        for(const email of listOfEmails){
            //send Email
            try{
                const res = await sendEmail.run("New Friend Requests pending for "+ email, "There are so many friend requests pending. Please login to the DevConnect and accept or reject the requests. ")
                console.log(res);
            }catch(err){
                console.log(err)
            }
        }

    }catch(err){
        console.err(err);
    }
});