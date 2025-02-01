const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")

app.post("/signup", async (req, res)=>{
    const data = req.body;
    // const userObject = {
    //     firstName: "Avi",
    //     lastName: "Sah",
    //     emailId: "avi@gmail.com",
    //     password: "Avi@123",
    //     age: "22",
    //     gender: "Male"
    // }
    
    // Creating a new instance of the User model
    const user = new User(data);
    // const user = new User(userObject);
    try{
    await user.save();
    res.send("User Added Successfully!");
    }
    catch(err){
        res.status(400).send('Error saving the user: '+ err.message);
    }
});

// Get user by gmail id
app.get("/user", async (req, res)=>{
    const userEmail = req.body.email;

    try{
        const users = await User.findOne({emailId: userEmail});
            if(users.length === 0){
                res.status(404).send("User not found");
            }
            else{
                res.send(user);
            }
        res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong")
    }
    
});
// Get user by gmail id
app.get("/user", async (req, res)=>{
    const userEmail = req.body.email;

    try{
        await User.findOne({emailId: userEmail});

        res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong")
    }
    
});
// Get user by gmail id
app.get("/user", async (req, res)=>{
    const userEmail = req.body.email;

    try{
        await User.findOne({emailId: userEmail});

        res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong")
    }
    
});
// Get user by gmail id
app.get("/user", async (req, res)=>{
    const userEmail = req.body.email;

    try{
        await User.findOne({emailId: userEmail});

        res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong")
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
    console.log("Server is running at port 7777");
});