import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomDetails, clearError } from '../redux/slices/roomSlice';
import { createBooking, clearMessage, clearError as clearBookingError } from '../redux/slices/bookingSlice';
import BookingForm from '../components/booking/BookingForm';
import Loader from '../components/common/Loader';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentRoom, loading, error } = useSelector((state) => state.rooms);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: bookingLoading, message: bookingMessage, error: bookingError } = useSelector((state) => state.bookings);
  
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getRoomDetails(id));
    }
    
    return () => {
      dispatch(clearError());
      dispatch(clearBookingError());
      dispatch(clearMessage());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (bookingMessage) {
      alert('Booking created successfully!');
      setShowBookingForm(false);
      navigate('/dashboard');
    }
  }, [bookingMessage, navigate]);

  const handleBookRoom = () => {
    if (!isAuthenticated) {
      alert('Please login to book a room');
      navigate('/login');
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      await dispatch(createBooking({
        ...bookingData,
        roomId: currentRoom._id
      })).unwrap();
    } catch (error) {
      // Error handled by Redux
    }
  };

  if (loading) {
    return <Loader text="Loading room details..." />;
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="container">
          <div className="error-content">
            <h2>Room Not Found</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Back to Rooms
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return null;
  }

  return (
    <div className="room-details-page">
      <div className="container">
        <div className="room-details-content">
          <div className="room-header">
            <div className="room-title">
              <h1>Room {currentRoom.number}</h1>
              <span className={`status-badge status-${currentRoom.status}`}>
                {currentRoom.status}
              </span>
            </div>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              ← Back to Rooms
            </button>
          </div>

          <div className="room-main-info">
            <div className="room-info-card">
              <h2>{currentRoom.type}</h2>
              <p className="room-description">
                {currentRoom.description || 'Comfortable room with modern amenities'}
              </p>
              
              <div className="room-specs">
                <div className="spec-item">
                  <strong>Max Guests:</strong> {currentRoom.maxGuests}
                </div>
                <div className="spec-item">
                  <strong>Price:</strong> ${currentRoom.price} per night
                </div>
              </div>

              {currentRoom.amenities && currentRoom.amenities.length > 0 && (
                <div className="amenities-section">
                  <h3>Amenities</h3>
                  <ul className="amenities-list">
                    {currentRoom.amenities.map((amenity, index) => (
                      <li key={index} className="amenity-item">
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="booking-section">
              <div className="booking-card">
                <h3>Book This Room</h3>
                <div className="price-display">
                  <span className="price">${currentRoom.price}</span>
                  <span className="period">/night</span>
                </div>
                
                {currentRoom.status === 'available' ? (
                  <>
                    {!showBookingForm ? (
                      <button 
                        onClick={handleBookRoom} 
                        className="btn btn-primary btn-full"
                      >
                        Book Now
                      </button>
                    ) : (
                      <div>
                        <BookingForm
                          onSubmit={handleBookingSubmit}
                          onCancel={() => setShowBookingForm(false)}
                          loading={bookingLoading}
                          room={currentRoom}
                        />
                        {bookingError && (
                          <div className="error-message">
                            <p>{bookingError}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <button className="btn btn-disabled btn-full" disabled>
                    Room Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;