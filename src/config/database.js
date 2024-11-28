const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://abhinandansah222:*****@devconnect-cluster.qfhxv.mongodb.net/devConnect")
}

module.exports = connectDB;

connectDB()
    .then(()=>{
        console.log("Database connected successfully")
    })
    .catch((err)=>{
        console.log("Database cannot be connected");
    })