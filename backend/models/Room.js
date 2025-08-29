import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, "Please enter room number"],
      unique: true,
      maxLength: [10, "Room number cannot exceed 10 characters"],
    },
    type: {
      type: String,
      required: [true, "Please enter room type"],
      enum: {
        values: ["Single", "Double", "Suite"],
        message: "Please select room type: Single, Double, or Suite",
      },
    },
    price: {
      type: Number,
      required: [true, "Please enter room price"],
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    description: {
      type: String,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    amenities: [
      {
        type: String,
      },
    ],
    maxGuests: {
      type: Number,
      required: [true, "Please enter maximum guests"],
      min: [1, "Maximum guests must be at least 1"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
roomSchema.index({ type: 1, status: 1, price: 1 });

export default mongoose.model("Room", roomSchema);
