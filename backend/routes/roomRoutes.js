import express from 'express';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';
import { createRoom, deleteRoom, getAllRooms, getRoomDetails, updateRoom } from '../controllers/roomController.js';

const router = express.Router();

//Create Room(Admin)
router.post('/create', isAuthenticated, authorizeAdmin, createRoom);
//Update room(Admin)
router.put('/update/:id', isAuthenticated, authorizeAdmin, updateRoom);
//Delete room(Admin)
router.delete('/delete/:id', isAuthenticated, authorizeAdmin, deleteRoom);

//Get all rooms
router.get('/get', getAllRooms);
//Get single room
router.get('/get/:id', getRoomDetails);

export default router;