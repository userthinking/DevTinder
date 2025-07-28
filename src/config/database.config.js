import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("Connected to the Database...");
};

export default connectDB;