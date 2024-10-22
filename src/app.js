const express = require('express');
const app = express();

app.use("/", (req, res)=>{
    res.send("Hello World");
})

app.listen(8080, (req, res)=>{
    console.log("Server is running at port 8080");
})