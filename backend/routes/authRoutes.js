import express from 'express';
import { getProfile, loginUser, logout, registerUser, updateProfile } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

//Register route
router.post("/register", registerUser);

//Login route
router.post("/login", loginUser);

//Logout route
router.post("/logout", logout);

//Profile route
router.get("/profile", isAuthenticated, getProfile);

//Update Profile route
router.put("/update-profile", isAuthenticated, updateProfile);

export default router;