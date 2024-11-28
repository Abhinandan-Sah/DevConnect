const express = require('express');
const app = express();
const connectDB = require("./config/database");

app.use("/", (req, res)=>{
    res.send("Hello World");
})

app.listen(8080, (req, res)=>{
    console.log("Server is running at port 8080");
});