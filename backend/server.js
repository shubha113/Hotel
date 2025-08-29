import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import ErrorMiddleware from './middlewares/error.js';
import authRoutes from './routes/authRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import cookieParser from 'cookie-parser';

//load env variables
dotenv.config();

//connect to database
connectDatabase();
const app = express();

//cors middleware, to give the access to the frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

//middleware to parse the incoming data
app.use(express.json());

//middleware to parse cookie
app.use(cookieParser());

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/room', roomRoutes);
app.use('/api/v1/booking', bookingRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(ErrorMiddleware);