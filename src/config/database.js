const mongoose = require("mongoose");
require('dotenv').config()

const connectDB = async () => {
    await mongoose.connect(DB_URL)
}

module.exports = connectDB;

