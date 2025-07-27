import express from 'express'
import { userAuth } from '../middlewares/auth.middleware.js'
import ConnectionRequest from '../models/connectionRequest.model.js'
import User from '../models/user.model.js'

const requestRouter = express.Router()

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const { status, toUserId } = req.params

        const ALLOWED_STATUS = ["interested", "ignored"]

        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status type" })
        }

        const isToUserExist = await User.findById(toUserId)
        if (!isToUserExist) {
            return res.status(404).json({ success: false, message: "toUser does not exist" })
        }

        // Check if there is an existing connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) {
            return res.status(400).json({ success: false, message: "Connection already exists" })
        }

        const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status })
        const data = await connectionRequest.save()

        res.status(200).json({ success: true, message: status === "interested" ? "Connection request sent successfully" : "Connection request ingored", data })

    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ success: false, message: error.message })
    }
})

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const { status, requestId } = req.params

        const ALLOWED_STATUS = ["accepted", "rejected"]
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status type" })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if (!connectionRequest) {
            return res.status(400).json({ success: false, message: "Connection request does not exist" })
        }

        connectionRequest.status = status
        const updatedData = await connectionRequest.save()

        res.status(200).json({ success: true, message: `Connection request ${status}`, data: updatedData })

    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ success: false, message: error.message })
    }
})

export default requestRouter