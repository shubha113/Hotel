import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

// Async thunk for getting all rooms
export const getAllRooms = createAsyncThunk(
  "rooms/getAllRooms",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_URL}/room/get?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rooms"
      );
    }
  }
);

// Async thunk for getting single room
export const getRoomDetails = createAsyncThunk(
  "rooms/getRoomDetails",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/room/get/${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch room details"
      );
    }
  }
);

// Async thunk for creating room (Admin only)
export const createRoom = createAsyncThunk(
  "rooms/createRoom",
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/room/create`, roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create room"
      );
    }
  }
);

// Async thunk for updating room (Admin only)
export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ roomId, roomData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/room/update/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update room"
      );
    }
  }
);

// Async thunk for deleting room (Admin only)
export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/room/delete/${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete room"
      );
    }
  }
);

// Initial state
const initialState = {
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
  message: null,
  totalCount: 0,
};

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all rooms
      .addCase(getAllRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.rooms;
        state.totalCount = action.payload.count;
      })
      .addCase(getAllRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get room details
      .addCase(getRoomDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload.room;
      })
      .addCase(getRoomDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create room
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.unshift(action.payload.room);
        state.message = action.payload.message;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update room
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rooms.findIndex(
          (room) => room._id === action.payload.room._id
        );
        if (index !== -1) {
          state.rooms[index] = action.payload.room;
        }
        state.message = action.payload.message;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete room
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter((room) => room._id !== action.meta.arg);
        state.message = action.payload.message;
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage, setCurrentRoom } = roomSlice.actions;
export default roomSlice.reducer;