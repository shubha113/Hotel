const BookingCard = ({ booking, onCancel, showCancelButton = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const canCancel = () => {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }
    
    const checkInDate = new Date(booking.checkIn);
    const currentDate = new Date();
    
    return checkInDate > currentDate;
  };

  return (
    <div className="booking-card">
      <div className="booking-header">
        <div className="booking-id">
          Booking #{booking._id.slice(-6)}
        </div>
        <div className={`booking-status ${getStatusColor(booking.status)}`}>
          {booking.status}
        </div>
      </div>

      <div className="booking-details">
        <div className="room-info">
          <h3>Room {booking.room?.number || 'N/A'} - {booking.room?.type || 'N/A'}</h3>
          <p className="guest-info">
            <strong>Guest:</strong> {booking.guestName}
          </p>
          <p className="guest-email">
            <strong>Email:</strong> {booking.guestEmail}
          </p>
        </div>

        <div className="date-info">
          <div className="date-item">
            <span className="date-label">Check-in:</span>
            <span className="date-value">{formatDate(booking.checkIn)}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Check-out:</span>
            <span className="date-value">{formatDate(booking.checkOut)}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Nights:</span>
            <span className="date-value">{booking.totalNights}</span>
          </div>
        </div>
      </div>

      {showCancelButton && canCancel() && (
        <div className="booking-actions">
          <button
            onClick={() => onCancel(booking._id)}
            className="btn btn-danger btn-small"
          >
            Cancel Booking
          </button>
        </div>
      )}

      <div className="booking-footer">
        <small className="booking-date">
          Booked on: {formatDate(booking.createdAt)}
        </small>
      </div>
    </div>
  );
};

export default BookingCard;