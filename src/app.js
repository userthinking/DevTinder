import express from 'express'
import cookieParser from 'cookie-parser';

import connectDB from './config/database.config.js';
import authRouter from './routes/auth.route.js';
import profileRouter from './routes/profile.route.js';

const app = express()

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/', authRouter)
app.use('/', profileRouter)

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