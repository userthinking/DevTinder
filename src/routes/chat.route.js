import express from 'express'
import Chat from '../models/chat.model.js'
import { userAuth } from '../middlewares/auth.middleware.js'

const chatRouter = express.Router()

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    const { targetUserId } = req.params
    const userId = req.user._id

    try {
        let chat = await Chat.findOne({
            participants: {
                $all: [userId, targetUserId]
            }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName photoUrl"
        })

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })
        }

        await chat.save()
        res.status(200).json({ success: true, message: "messages fetched successfully", chat })

    } catch (error) {
        console.log(error);
    }
})

export default chatRouter