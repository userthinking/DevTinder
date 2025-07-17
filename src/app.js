import express from 'express'
import connectDB from './config/database.config.js';
import User from './models/user.model.js';

const app = express()

app.use(express.json())

// User Signup
app.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ success: true, message: "User added successfully", data: user });
    } catch (error) {
        console.error("Error during user signup:", error.message);
        res.status(400).json({ success: false, message: "Failed to create user", error: error.message });
    }
});

// Get User by ID
app.get("/user/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Email ID is required" });

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "User fetched successfully", data: user });
    } catch (error) {
        console.error("Error getting user:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// Feed API - Get All Users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, message: "Users fetched successfully", data: users });
    } catch (error) {
        console.error("Error getting users:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// Delete User by ID
app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// Update User by ID
app.patch("/user/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body
    try {
        const UPDATES_ALLOWED = ["firstName", "lastName", "age", "about", "skills", "photoUrl"]
        const isUpdateAllowed = Object.keys(data).every((key) => UPDATES_ALLOWED.includes(key))

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }

        if (data?.skills?.length > 30) {
            throw new Error("Skills should not be more than 30");
        }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(400).json({ success: false, message: "Failed to update user", error: error.message });
    }
});


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