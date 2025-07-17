import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/devTinder');
    console.log("Connected to the Database...");
};

export default connectDB;