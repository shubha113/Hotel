import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendToken } from "../utils/sendToken.js";

//Register User
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if email and password are provided
  if (!name || !email || !password || !role) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

// Login user
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, res, 200, "Login successful");
});

// Logout user
export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

//Get user profile
export const getProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Update profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Update the user's name and email if they are provided in the request body.
  if (req.body.name) {
    user.name = req.body.name;
  }
  if (req.body.email) {
    user.email = req.body.email;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
