const express = require('express');
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    const data = req.body;
    const user = new User(data);
    try {
        await user.save();
        res.send("User Added Successfully!");
    } catch (err) {
        res.status(400).send('Error saving the user: ' + err.message);
    }
});

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
        res.status(500).send('Error retrieving the user: ' + err.message);
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
        res.status(500).send('Error retrieving users: ' + err.message);
    }
});

// DELETE  using delete request
app.delete("/user", async (req, res)=>{
    const userId = req.body.userId;
    // const user = await User.findByIdAndDelete({_id: userId});
    try{
        const user = await User.findByIdAndDelete(userId);
        if(user){
            res.send("user deleted successfully");
        }else{
            res.status(404).send("No users found");
        }
    }
    catch(err){
        res.status(500).send('Error retrieving users: ' + err.message);
    }
});

app.get("/", async (req, res) => {
    res.send("hello from server");
});

app.patch("/user", async(req, res)=>{
    const userId = req.body.userId;
    const body= req.body;

    try{
        const user= await User.findByIdAndUpdate({_id: userId}, body);
        if(user){
            res.send("user record updated successfully");
        }else{
            res.send("user not found");
        }
    }catch(err){
        res.status(500).send('Error retrieving users: ' + err.message)
    }
});

connectDB().then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.log("Database cannot be connected");
});

app.listen(5000, () => {
    console.log("Server is running at port 5000");
});