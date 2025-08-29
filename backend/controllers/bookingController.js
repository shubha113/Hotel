import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Create new booking
export const createBooking = catchAsyncError(async (req, res, next) => {
  const { roomId, guestName, guestEmail, checkIn, checkOut } = req.body;

  if (!roomId || !guestName || !guestEmail || !checkIn || !checkOut) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const currentDate = new Date();

  if (checkInDate < currentDate) {
    return next(new ErrorHandler("Check-in date cannot be in the past", 400));
  }

  if (checkOutDate <= checkInDate) {
    return next(
      new ErrorHandler("Check-out date must be after check-in date", 400)
    );
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  if (room.status !== "available") {
    return next(new ErrorHandler("Room is not available for booking", 400));
  }

  const existingBooking = await Booking.findOne({
    room: roomId,
    status: { $in: ["confirmed", "pending"] },
    $or: [
      {
        checkIn: { $lte: checkOutDate },
        checkOut: { $gte: checkInDate },
      },
    ],
  });

  if (existingBooking) {
    return next(
      new ErrorHandler("Room is already booked for the selected dates", 400)
    );
  }

  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );
  const amount = nights * room.price;

  const booking = await Booking.create({
    user: req.user._id,
    room: roomId,
    guestName,
    guestEmail,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalNights: nights,
    totalAmount: amount,
  });

  await Room.findByIdAndUpdate(roomId, { status: "booked" });

  // Populate the booking data
  const createdBooking = await Booking.findById(booking._id)
    .populate("room", "number type price")
    .populate("user", "name email");

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    booking: createdBooking,
  });
});

// Get user's bookings
export const getUserBookings = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 }).populate('room');

  const currentDate = new Date();
  const currentBookings = bookings.filter(
    (booking) => booking.checkOut >= currentDate
  );
  const pastBookings = bookings.filter(
    (booking) => booking.checkOut < currentDate
  );

  res.status(200).json({
    success: true,
    count: bookings.length,
    currentBookings,
    pastBookings,
    allBookings: bookings,
  });
});

// Get all bookings (Admin only)
export const getAllBookings = catchAsyncError(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;

  let filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("room");

  const total = await Booking.countDocuments(filter);

  // Calculate basic analytics
  const totalBookings = await Booking.countDocuments();
  const confirmedBookings = await Booking.countDocuments({
    status: "confirmed",
  });
  const totalRevenue = await Booking.aggregate([
    { $match: { status: "confirmed" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  res.status(200).json({
    success: true,
    count: bookings.length,
    total,
    bookings,
    analytics: {
      totalBookings,
      confirmedBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  });
});

// Cancel booking
export const cancelBooking = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  // Users can only cancel their own bookings, admins can cancel any booking
  if (
    req.user.role !== "admin" &&
    booking.user._id.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorHandler("You can only cancel your own bookings", 403));
  }

  // Check if booking can be cancelled
  if (booking.status === "cancelled") {
    return next(new ErrorHandler("Booking is already cancelled", 400));
  }

  if (booking.status === "completed") {
    return next(new ErrorHandler("Cannot cancel completed booking", 400));
  }

  // Check if check-in date has passed
  const currentDate = new Date();
  const checkInDate = new Date(booking.checkIn);

  if (checkInDate <= currentDate) {
    return next(
      new ErrorHandler("Cannot cancel booking after check-in date", 400)
    );
  }

  booking.status = "cancelled";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    booking,
  });
});
