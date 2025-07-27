import express from 'express'
import { userAuth } from '../middlewares/auth.middleware.js'
import ConnectionRequest from '../models/connectionRequest.model.js'
import User from '../models/user.model.js'

const userRouter = express.Router()

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const receivedRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills")

        res.status(200).json({ success: true, message: "Requests fetched successfully", requests: receivedRequests })

    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ success: false, message: error.message })
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const userConnections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", "firstName lastName photoUrl age gender about skills")
            .populate("toUserId", "firstName lastName photoUrl age gender about skills")

        const userConnectionsList = userConnections
            .map((connection) => {
                const { fromUserId, toUserId } = connection;
                if (!fromUserId || !toUserId) return null;

                return fromUserId._id.equals(loggedInUser._id) ? toUserId : fromUserId;
            })
            .filter(Boolean);

        res.status(200).json({ success: true, message: "Connections fetched successfully", connections: userConnectionsList })

    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ success: false, message: error.message })
    }
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = req.query.page
        let limit = req.query.limit
        limit = limit > 50 ? 50 : limit

        const skip = (page - 1) * limit

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((request) => {
            hideUsersFromFeed.add(request.fromUserId.toString())
            hideUsersFromFeed.add(request.toUserId.toString())
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName photoUrl age gender about skills").skip(skip).limit(limit)

        res.status(200).json({ success: true, message: "Feed fetched successfully", users })

    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ success: false, message: error.message })
    }
})

export default userRouter


