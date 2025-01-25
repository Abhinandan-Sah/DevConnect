const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")

app.post("/signup", async (req, res)=>{
    const data = req.body
    const userObject = {
        firstName: "Avi",
        lastName: "Sah",
        emailId: "avi@gmail.com",
        password: "Avi@123",
        age: "22",
        gender: "Male"
    }
    
    // Creating a new instance of the User model
    const user = new User(userObject);
    try{
    await user.save();
    res.send("User Added Successfully!");
    }
    catch(err){
        res.status(400).send('Error saving the user: '+ err.message);
    }
});

connectDB()
.then(()=>{
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Database cannot be connected");
});

app.listen(7777, (req, res)=>{
    console.log("Server is running at port 7777");
    console.log("Server is running at port 7777");
    console.log("Server is running at port 7777");
    console.log("Server is running at port 7777");
});