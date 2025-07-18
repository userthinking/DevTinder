import express from 'express'
import { validateUserSignUpData } from '../utils/validations.util.js';
import bcrypt from 'bcrypt'
import User from '../models/user.model.js';

const authRouter = express.Router()

// User Signup Route
authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        // Validate user data
        await validateUserSignUpData(req);

        // Encrypt password
        const hashPassword = await bcrypt.hash(password, 10);

        // Save user to DB
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword
        });

        await user.save();

        res.status(201).json({ success: true, message: "User added successfully", data: user });
    } catch (error) {
        console.error("Error during user signup:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});

// User Login Route
authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body

    try {
        if (!emailId || !password) {
            throw new Error("Email and password are required");
        }

        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error("Invalid email")
        }

        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            throw new Error("Invalid password")
        }

        // Create jwt token
        const jwtToken = await user.getJWT()

        // Add token to the cookie
        res.cookie('token', jwtToken, { httpOnly: true })

        res.status(200).json({ success: true, message: "User login successful" });

    } catch (error) {
        console.error("Error during user login:", error.message);
        res.status(400).json({ success: false, message: "Failed to login user", error: error.message });
    }
})

// User Logout Route
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) })
    res.status(200).json({ success: true, message: "Logout successful" })
})

export default authRouter