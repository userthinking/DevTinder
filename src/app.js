import express from 'express'
import connectDB from './config/database.config.js';
import User from './models/user.model.js';

const app = express()

app.use(express.json())

//User signup
app.post("/signup", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).json({ message: "User Added Successfully", data: user })
    } catch (error) {
        console.log("Error during user signup", error);
        res.status(401).json({ error: error })
    }
})

//Get user by email
app.get("/user", async (req, res) => {
    const emailId = req.body.emailId
    try {
        const user = await User.find({ emailId })

        if (user.length === 0) {
            return res.status(404).json({ message: "User Not Found" })
        }

        res.status(200).json({ message: "User Fetched Successfully", data: user })
    } catch (error) {
        console.log("Error getting user", error);
        res.status(404).json({ error: error })
    }
})

//Feed API - Get all users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({ message: "Users Fetched Successfully", data: users })
    } catch (error) {
        console.log("Error getting users", error);
        res.status(404).json({ error: error })
    }
})

//Delete user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId

    try {
        await User.findByIdAndDelete(userId)
        res.status(200).json({ message: "Users Deleted Successfully" })
    } catch (error) {
        console.log("Error Deleting user", error);
        res.status(404).json({ error: error })
    }
})

//Update user
app.patch("/user", async (req, res) => {
    const userId = req.body.userId
    const data = req.body

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, data , { new: true, runValidators: true })
        if (!updatedUser) {
            return res.status(404).json({ message: "User Not Found" })
        }

        res.status(200).json({ message: "User Updated Successfully" })
    } catch (error) {
        console.log("Error updating user", error);
        res.status(404).json({ error: error.message })
    }
})

//Start server
const startServer = async () => {
    try {
        await connectDB()
        app.listen(6969, () => {
            console.log("server running on 6969...");
        })
    } catch (error) {
        console.log("Database connection error: ", error);
        process.exit(1)
    }
}
startServer()