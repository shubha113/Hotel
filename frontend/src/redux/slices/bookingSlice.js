import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

// Async thunk for creating booking
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/booking/create`, bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

// Async thunk for getting user bookings
export const getUserBookings = createAsyncThunk(
  "bookings/getUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/booking/my-bookings`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

// Async thunk for getting all bookings (Admin only)
export const getAllBookings = createAsyncThunk(
  "bookings/getAllBookings",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_URL}/booking/get`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all bookings"
      );
    }
  }
);

// Async thunk for canceling booking
export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/booking/cancel/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  }
);

// Initial state
const initialState = {
  bookings: [],
  currentBookings: [],
  pastBookings: [],
  allBookings: [], // for admin
  analytics: null,
  loading: false,
  error: null,
  message: null,
  totalCount: 0,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearBookings: (state) => {
      state.bookings = [];
      state.currentBookings = [];
      state.pastBookings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload.booking);
        state.currentBookings.unshift(action.payload.booking);
        state.message = action.payload.message;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user bookings
      .addCase(getUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.allBookings || action.payload.bookings;
        state.currentBookings = action.payload.currentBookings || [];
        state.pastBookings = action.payload.pastBookings || [];
        state.totalCount = action.payload.count;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get all bookings (Admin)
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload.bookings;
        state.analytics = action.payload.analytics;
        state.totalCount = action.payload.total;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const bookingId = action.payload.booking._id;
        
        // Update booking status in all arrays
        const updateBookingStatus = (bookings) => {
          return bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          );
        };

        state.bookings = updateBookingStatus(state.bookings);
        state.currentBookings = updateBookingStatus(state.currentBookings);
        state.allBookings = updateBookingStatus(state.allBookings);
        state.message = action.payload.message;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;