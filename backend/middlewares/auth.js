import ErrorHandler from "../utils/ErrorHandler.js";
import {catchAsyncError }from '../middlewares/catchAsyncError.js'
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

// Check if user is authenticated
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies || {};
    const authHeader = req.headers.authorization;
    
    let authToken = token;
    console.log("Incoming token:", authToken);

    
    // Check if token is in Authorization header
    if (!authToken && authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.split(' ')[1];
    }

    if (!authToken) {
        return next(new ErrorHandler('Please login to access this resource', 401));
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return next(new ErrorHandler('User not found', 404));
        }
        
        next();
    } catch (error) {
        return next(new ErrorHandler('Invalid token', 401));
    }
});

// Middleware to authorize admin access
export const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  if (req.user.role !== "admin") {
    return next(
      new ErrorHandler(
        "Access denied: Only admin can access this resource",
        403
      )
    );
  }

  next();
};
