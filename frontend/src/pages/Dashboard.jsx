import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings, cancelBooking, clearMessage, clearError } from '../redux/slices/bookingSlice';
import BookingCard from '../components/booking/BookingCard';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    currentBookings, 
    pastBookings, 
    loading, 
    error, 
    message 
  } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getUserBookings());
    
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      alert(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  };

  if (loading) {
    return <Loader text="Loading your bookings..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Manage your hotel bookings</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="dashboard-content">
          {/* Current Bookings */}
          <section className="bookings-section">
            <div className="section-header">
              <h2>Current Bookings</h2>
              <span className="count">
                {currentBookings?.length || 0} booking{(currentBookings?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            
            {currentBookings && currentBookings.length > 0 ? (
              <div className="bookings-grid">
                {currentBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCancel={handleCancelBooking}
                    showCancelButton={true}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No current bookings</h3>
                <p>You don't have any upcoming bookings.</p>
                <a href="/" className="btn btn-primary">
                  Browse Rooms
                </a>
              </div>
            )}
          </section>

          {/* Past Bookings */}
          <section className="bookings-section">
            <div className="section-header">
              <h2>Past Bookings</h2>
              <span className="count">
                {pastBookings?.length || 0} booking{(pastBookings?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            
            {pastBookings && pastBookings.length > 0 ? (
              <div className="bookings-grid">
                {pastBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCancel={null}
                    showCancelButton={false}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No past bookings</h3>
                <p>Your booking history will appear here.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;