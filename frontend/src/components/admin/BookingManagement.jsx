import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookings, createBooking, cancelBooking, clearMessage, clearError } from '../../redux/slices/bookingSlice';
import { getAllRooms } from '../../redux/slices/roomSlice';

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const BookingManagement = () => {
  const dispatch = useDispatch();
  const { allBookings, loading, error, message } = useSelector(
    (state) => state.bookings
  );
  
  const { rooms } = useSelector((state) => state.rooms);

  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [formData, setFormData] = useState({
    guestName: '',
    room: '',
    checkInDate: '',
    checkOutDate: '',
  });

  useEffect(() => {
    if (rooms.length === 0) {
      dispatch(getAllRooms());
    }

    // Clean up any old errors or messages when the component unmounts
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch, rooms.length]);

  useEffect(() => {
    // Handle success messages and close the form
    if (message) {
      handleCloseForm();
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        // NOTE: Your booking slice does not have an 'updateBooking' thunk yet.
        // You'll need to add it to enable this functionality.
        // For now, this will not work.
        // await dispatch(updateBooking({ bookingId: editingBooking._id, bookingData: formData })).unwrap();
        console.error("Update functionality is not yet implemented in the booking slice.");
      } else {
        const bookingData = {
          ...formData,
          checkIn: formData.checkInDate,
          checkOut: formData.checkOutDate,
          // The backend will calculate totalAmount based on room price and dates
        };
        await dispatch(createBooking(bookingData)).unwrap();
      }
      dispatch(getAllBookings()); // Refresh the list
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      guestName: booking.guestName,
      room: booking.room?.id || '', // Populate the room ID
      checkInDate: booking.checkIn.split('T')[0], // Format date for input
      checkOutDate: booking.checkOut.split('T')[0], // Format date for input
    });
    setShowForm(true);
  };

  const handleCancel = (bookingId) => {
    setConfirmMessage('Are you sure you want to cancel this booking? This action cannot be undone.');
    setConfirmAction(() => async () => {
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
        setShowConfirmModal(false);
      } catch (err) {
        console.error('Cancellation failed:', err);
      }
    });
    setShowConfirmModal(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBooking(null);
    setFormData({
      guestName: '',
      room: '',
      checkInDate: '',
      checkOutDate: '',
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="booking-management">
      <div className="header-content">
        <h2 className="header-title">Booking Management</h2>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Action</h3>
            <p className="modal-message">{confirmMessage}</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={confirmAction} className="btn-danger">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingBooking ? 'Edit Booking' : 'Add New Booking'}
              </h3>
              <button onClick={handleCloseForm} className="modal-close">
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label htmlFor="guestName">Guest Name *</label>
                <input
                  type="text"
                  id="guestName"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., John Doe"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="room">Room Number *</label>
                <select
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      Room {room.number} ({room.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="checkInDate">Check-in Date *</label>
                <input
                  type="date"
                  id="checkInDate"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkOutDate">Check-out Date *</label>
                <input
                  type="date"
                  id="checkOutDate"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="booking-grid-container">
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p className="loader-text">Loading bookings...</p>
          </div>
        ) : allBookings?.length > 0 ? (
          <div className="booking-grid">
            {allBookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <span className="booking-guest">{booking.guestName}</span>
                  <span className={`booking-status status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-info">
                  <h3 className="booking-room">Room #{booking?.room?.number || 'N/A'}</h3>
                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="detail-label">Check-in:</span>
                      <span className="detail-value">{formatDate(booking.checkIn)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Check-out:</span>
                      <span className="detail-value">{formatDate(booking.checkOut)}</span>
                    </div>
                  </div>
                </div>
                <div className="booking-footer">
                  <div className="booking-price">
                    <span className="price-amount">{formatCurrency(booking.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="empty-title">No bookings found</h3>
            <p className="empty-text">Add your first booking to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;