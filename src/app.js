import express from 'express'
import connectDB from './config/database.config.js';
import User from './models/user.model.js';
import validateUserSignUpData from './utils/validations.util.js';
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'

const app = express()

app.use(express.json())
app.use(cookieParser())

// User Signup
app.post("/signup", async (req, res) => {
    try {

        //validate user data
        validateUserSignUpData(req)

        //encrypt user password
        const { firstName, lastName, emailId, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)

        //save user to the database
        const user = new User({
            firstName, lastName, emailId, password: hashPassword
        });

        await user.save();
        res.status(201).json({ success: true, message: "User added successfully", data: user });
    } catch (error) {
        console.error("Error during user signup:", error.message);
        res.status(400).json({ success: false, message: "Failed to create user", error: error.message });
    }
});

// User Login
app.post("/login", async (req, res) => {
    const { emailId, password } = req.body

    try {
        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error("Invalid email")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error("Invalid password")
        }

        // Create jwt token
        const jwtToken = jwt.sign({ _id: user._id }, "boomshakalaka69", { expiresIn: "1h" })

        // Add token to the cookie
        res.cookie('token', jwtToken)

        res.status(200).json({ success: true, message: "User login successful" });

    } catch (error) {
        console.error("Error during user login:", error.message);
        res.status(400).json({ success: false, message: "Failed to login user", error: error.message });
    }
})

// Get User Profile
app.get("/profile", async (req, res) => {
    try {
        const { token } = req.cookies
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        // Validate token
        const decodedToken = jwt.verify(token, "boomshakalaka69")
        const { _id } = decodedToken

        const userProfile = await User.findById(_id)
        if (!userProfile) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.status(200).json({ success: true, message: "User profile fetched successfully", data: userProfile })

    } catch (error) {
        console.error("Error during fetching profile:", error.message);
        res.status(400).json({ success: false, message: "Failed to fetch user profile", error: error.message });
    }
})

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
        const UPDATES_ALLOWED = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl"]
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