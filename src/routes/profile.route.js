import express from 'express'
import bcrypt from 'bcrypt'
import { userAuth } from '../middlewares/auth.middleware.js';
import { validateProfileEditData } from '../utils/validations.util.js';

const profileRouter = express.Router()
// Get User Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({ success: true, message: "User profile fetched successfully", user })

    } catch (error) {
        console.error("Error during fetching profile:", error.message);
        res.status(400).json({ success: false, message: "Failed to fetch user profile", error: error.message });
    }
})

// Edit User Profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid edit request")
        }

        const loggedInUser = req.user

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

        await loggedInUser.save()
        res.status(200).json({ success: true, message: "Edit successful", loggedInUser })

    } catch (error) {
        console.error("Error during edit profile:", error.message);
        res.status(400).json({ success: false, message: "Failed to edit user profile", error: error.message });
    }
})

// Edit User Password
profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const loggedInUser = req.user

        const isPasswordMatch = await bcrypt.compare(currentPassword, loggedInUser.password)

        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: "Incorrect current password" })
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10)
        loggedInUser.password = newPasswordHash

        await loggedInUser.save()

        res.status(200).json({ success: true, message: "password updated successfully" })
    } catch (error) {
        console.error("Error updating password:", error.message);
        res.status(400).json({ success: false, message: "Failed to edit password", error: error.message });
    }
})

export default profileRouter