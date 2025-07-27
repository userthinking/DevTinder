import User from "../models/user.model.js"
import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if (!token) {
            return res.status(401).json({ success: false, message: "Please Login!" })
        }

        const decoded = jwt.verify(token, "boomshakalaka69")
        const { _id } = decoded

        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User not found")
        }

        req.user = user
        next()
    } catch (error) {
        console.error("Error:", error.message);
        res.status(400).json({ success: false, error: error.message });
    }

}

export { userAuth }