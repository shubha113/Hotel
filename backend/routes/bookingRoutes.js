import express from 'express';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';
import { cancelBooking, createBooking, getAllBookings, getUserBookings } from '../controllers/bookingController.js';

const router = express.Router();

//Create booking
router.post('/create', isAuthenticated, createBooking);
//Get user bookings
router.get('/my-bookings', isAuthenticated, (req, res, next) => {
    req.params.userId = req.user._id;
    next();
}, getUserBookings);
//Get all bookings
router.get('/get', isAuthenticated, authorizeAdmin, getAllBookings);
//Cancel booking
router.post('/cancel/:id', isAuthenticated, cancelBooking);

export default router;