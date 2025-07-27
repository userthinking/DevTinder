import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'

import connectDB from './config/database.config.js';
import authRouter from './routes/auth.route.js';
import profileRouter from './routes/profile.route.js';
import requestRouter from './routes/connectionRequest.route.js';
import userRouter from './routes/user.route.js';

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