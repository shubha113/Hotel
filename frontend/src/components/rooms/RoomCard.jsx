import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'booked':
        return 'status-booked';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="room-card">
      <div className="room-header">
        <div className="room-number">Room {room.number}</div>
        <div className={`room-status ${getStatusColor(room.status)}`}>
          {room.status}
        </div>
      </div>

      <div className="room-info">
        <h3 className="room-type">{room.type}</h3>
        <p className="room-description">
          {room.description || 'Comfortable room with modern amenities'}
        </p>
        
        <div className="room-details">
          <div className="detail-item">
            <span className="detail-label">Max Guests:</span>
            <span className="detail-value">{room.maxGuests}</span>
          </div>
          
          {room.amenities && room.amenities.length > 0 && (
            <div className="detail-item">
              <span className="detail-label">Amenities:</span>
              <span className="detail-value">
                {room.amenities.slice(0, 3).join(', ')}
                {room.amenities.length > 3 && '...'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="room-footer">
        <div className="room-price">
          <span className="price-amount">${room.price}</span>
          <span className="price-period">/night</span>
        </div>
        
        <div className="room-actions">
          <Link 
            to={`/rooms/${room._id}`} 
            className="btn btn-primary"
            aria-label={`View details for room ${room.number}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;