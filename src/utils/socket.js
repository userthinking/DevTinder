import { Server } from 'socket.io'
import Chat from '../models/chat.model.js'

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        socket.on('joinChat', ({ userId, targetUserId }) => {
            const roomId = [userId, targetUserId].sort().join("_")
            socket.join(roomId)
        })

        socket.on('sendMessage', async ({ firstName, lastName, userId, targetUserId, photoUrl, text }) => {
            const roomId = [userId, targetUserId].sort().join("_")

            try {
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                })

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }

                const newMsg = {
                    senderId: userId,
                    message: text,
                    createdAt: new Date() // manually adding createdAt
                }

                chat.messages.push(newMsg)
                await chat.save()

                io.to(roomId).emit("messageReceived", {
                    firstName,
                    lastName,
                    photoUrl,
                    text,
                    time: newMsg.createdAt.toISOString()
                })

            } catch (error) {
                console.error(error)
            }
        })

        socket.on('disconnect', () => { })
    })
}

export default initializeSocket
