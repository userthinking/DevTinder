import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import http from 'http'
import connectDB from './config/database.config.js';
import authRouter from './routes/auth.route.js';
import profileRouter from './routes/profile.route.js';
import requestRouter from './routes/connectionRequest.route.js';
import userRouter from './routes/user.route.js';
import initializeSocket from './utils/socket.js';
import chatRouter from './routes/chat.route.js';

dotenv.config()
const app = express()


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
app.use('/', chatRouter)

const server = http.createServer(app)
initializeSocket(server)

//Start server
const startServer = async () => {
    try {
        await connectDB()
        server.listen(process.env.PORT, () => {
            console.log(`server running on ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Database connection error: ", error);
        process.exit(1)
    }
}
startServer()