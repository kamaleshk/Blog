require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB running on port ${connection.connection.port}`);
    console.log(`Database ${connection.connection.name}`);
  } catch (e) {
    console.log(e,"Error while connecting MongoDB");
    process.exit(1);
  }
};

module.exports = connectDB;
