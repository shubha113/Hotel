import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import ErrorHandler from "../utils/ErrorHandler.js";

//Create new room(Admin)
export const createRoom = catchAsyncError(async (req, res, next) => {
  const { number, type, price, description, amenities, maxGuests } = req.body;

  // Check if room number already exists
  const existingRoom = await Room.findOne({ number });
  if (existingRoom) {
    return next(new ErrorHandler("Room with this number already exists", 400));
  }

  const room = await Room.create({
    number,
    type,
    price,
    description,
    amenities: amenities || [],
    maxGuests: maxGuests || 1,
  });

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    room,
  });
});

//Update room(Admin)
export const updateRoom = catchAsyncError(async (req, res, next) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
        return next(new ErrorHandler('Room not found', 404));
    }

    // Check for unique room number
    if (req.body.number && req.body.number !== room.number) {
        const existingRoom = await Room.findOne({ number: req.body.number });
        if (existingRoom) {
            return next(new ErrorHandler('Room with this number already exists', 400));
        }
    }

    // Update room
    if (req.body.number) room.number = req.body.number;
    if (req.body.type) room.type = req.body.type;
    if (req.body.price) room.price = req.body.price;
    if (req.body.description) room.description = req.body.description;
    if (req.body.amenities) room.amenities = req.body.amenities;
    if (req.body.maxGuests) room.maxGuests = req.body.maxGuests;

    await room.save({ validateBeforeSave: true });

    res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        room
    });
});

//Delete room(Admin)
export const deleteRoom = catchAsyncError(async (req, res, next) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
        return next(new ErrorHandler('Room not found', 404));
    }

    // Check if room has any active bookings
    const activeBookings = await Booking.find({
        room: req.params.id,
        status: { $in: ['confirmed', 'pending'] },
        checkOut: { $gte: new Date() }
    });

    if (activeBookings.length > 0) {
        return next(new ErrorHandler('Cannot delete room with active bookings', 400));
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Room deleted successfully'
    });
});

// Get all available rooms with search and filter
export const getAllRooms = catchAsyncError(async (req, res, next) => {
  const { type, minPrice, maxPrice, checkIn, checkOut, status } = req.query;

  let filter = {};

  // Basic filters
  if (type) filter.type = type;
  if (status) filter.status = status;
  else filter.status = "available";

  // Price filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let rooms = await Room.find(filter).sort({ createdAt: -1 });

  // Filter with date
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return next(
        new ErrorHandler("Check-out date must be after check-in date", 400)
      );
    }

    // Find rooms that are booked during the requested period
    const bookedRooms = await Booking.find({
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate },
        },
      ],
    }).distinct("room");

    // Filter out booked rooms
    rooms = rooms.filter((room) => !bookedRooms.includes(room._id.toString()));
  }

  res.status(200).json({
    success: true,
    count: rooms.length,
    rooms,
  });
});

// Get single room details
export const getRoomDetails = catchAsyncError(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  res.status(200).json({
    success: true,
    room,
  });
});
