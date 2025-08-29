import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  clearMessage,
  clearError,
} from '../../redux/slices/roomSlice';

// A simple icon for the close button
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

const RoomManagement = () => {
  const dispatch = useDispatch();
  const { rooms, loading, error, message } = useSelector(
    (state) => state.rooms
  );

  // State to manage the visibility of the form and confirmation modal
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [formData, setFormData] = useState({
    number: '',
    type: 'Single',
    price: '',
    description: '',
    amenities: '',
    maxGuests: 1,
  });

  // Fetch all rooms when the component mounts
  useEffect(() => {
    dispatch(getAllRooms());

    // Clean up any old errors or messages when the component unmounts
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  // Handle messages from the Redux state (e.g., successful creation/update)
  useEffect(() => {
    if (message) {
      handleCloseForm();
      console.log('Success Message:', message);
    }
  }, [message, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      ...formData,
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      amenities: formData.amenities
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item),
    };

    try {
      if (editingRoom) {
        await dispatch(updateRoom({ roomId: editingRoom._id, roomData })).unwrap();
      } else {
        await dispatch(createRoom(roomData)).unwrap();
      }
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      type: room.type,
      price: room.price,
      description: room.description || '',
      amenities: room.amenities?.join(', ') || '',
      maxGuests: room.maxGuests,
    });
    setShowForm(true);
  };

  const handleDelete = (roomId) => {
    setConfirmMessage('Are you sure you want to delete this room? This action cannot be undone.');
    setConfirmAction(() => async () => {
      try {
        await dispatch(deleteRoom(roomId)).unwrap();
      } catch (err) {
        console.error('Delete failed:', err);
      }
      setShowConfirmModal(false);
    });
    setShowConfirmModal(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRoom(null);
    setFormData({
      number: '',
      type: 'Single',
      price: '',
      description: '',
      amenities: '',
      maxGuests: 1,
    });
  };

  const roomTypes = ['Single', 'Double', 'Suite'];

  return (
    <div className="room-management">
      {/* Page Header */}
      <div className="header-content">
        <h2 className="header-title">Room Management</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add New Room
        </button>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Custom Confirmation Modal */}
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <button onClick={handleCloseForm} className="modal-close">
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label htmlFor="number">Room Number *</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 101"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Room Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price per Night ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="e.g., 99.99"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxGuests">Max Guests *</label>
                <input
                  type="number"
                  id="maxGuests"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="10"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description of the room"
                  className="form-input"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="amenities">Amenities (comma-separated)</label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="e.g., WiFi, Air Conditioning, TV"
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
                  {loading ? 'Saving...' : editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms List */}
      <div className="room-grid-container">
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p className="loader-text">Loading rooms...</p>
          </div>
        ) : rooms.length > 0 ? (
          <div className="room-grid">
            {rooms.map((room) => (
              <div key={room._id} className="room-card">
                <div className="room-header">
                  <span className="room-number">Room #{room.number}</span>
                  <span className={`room-status ${room.status === 'available' ? 'status-available' : 'status-occupied'}`}>
                    {room.status}
                  </span>
                </div>
                <div className="room-info">
                  <h3 className="room-type">{room.type}</h3>
                  <p className="room-description">{room.description}</p>
                  <div className="room-details">
                    <div className="detail-item">
                      <span className="detail-label">Max Guests:</span>
                      <span className="detail-value">{room.maxGuests}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amenities:</span>
                      <span className="detail-value">{room.amenities?.join(', ') || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="room-footer">
                  <div className="room-price">
                    <span className="price-amount">${room.price.toFixed(2)}</span>
                    <span className="price-period">/night</span>
                  </div>
                  <div className="room-actions">
                    <button onClick={() => handleEdit(room)} className="btn-primary">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(room._id)} className="btn-primary">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="empty-title">No rooms found</h3>
            <p className="empty-text">Add your first room to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;
