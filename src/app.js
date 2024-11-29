const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")

app.post("/signup", async (req, res)=>{
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

    await user.save();
    res.send("User Added Successfully!");
    console.log("user added")
});

connectDB()
.then(()=>{
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Database cannot be connected");
});

app.listen(7777, (req, res)=>{
    console.log("Server is running at port 7777");
});