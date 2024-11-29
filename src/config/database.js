const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://abhinandansah222:xelGq7nDv3v1zgb5@devconnect-cluster.qfhxv.mongodb.net/devConnect")
}

module.exports = connectDB;

