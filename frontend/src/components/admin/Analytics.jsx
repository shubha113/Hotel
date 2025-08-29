import { useSelector } from 'react-redux';

const Analytics = () => {
  const { rooms } = useSelector((state) => state.rooms);
  const { analytics, allBookings } = useSelector((state) => state.bookings);

  // Calculate additional metrics
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(room => room.status === 'available').length;
  const bookedRooms = rooms.filter(room => room.status === 'booked').length;

  // Recent bookings (last 5)
  const recentBookings = allBookings?.slice(0, 5) || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Hotel Analytics Overview</h2>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🏨</div>
          <div className="metric-info">
            <h3>{totalRooms}</h3>
            <p>Total Rooms</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <h3>{availableRooms}</h3>
            <p>Available Rooms</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📋</div>
          <div className="metric-info">
            <h3>{analytics?.totalBookings || 0}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="analytics-sections">
        <div className="section">
          <h3>Recent Bookings</h3>
          <div className="recent-bookings">
            {recentBookings.length > 0 ? (
              <div className="bookings-table">
                <div className="table-header">
                  <div className="header-cell">Guest</div>
                  <div className="header-cell">Room</div>
                  <div className="header-cell">Check-in</div>
                  <div className="header-cell">Status</div>
                  <div className="header-cell">Amount</div>
                </div>
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="table-row">
                    <div className="cell">{booking.guestName}</div>
                    <div className="cell">Room {booking.room?.number}</div>
                    <div className="cell">{formatDate(booking.checkIn)}</div>
                    <div className="cell">
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="cell">{formatCurrency(booking.totalAmount)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No recent bookings found</p>
              </div>
            )}
          </div>
        </div>

        {/* Room Status Overview */}
        <div className="section">
          <h3>Room Status Distribution</h3>
          <div className="room-status-chart">
            <div className="status-item">
              <div className="status-indicator status-available"></div>
              <span>Available: {availableRooms}</span>
            </div>
            <div className="status-item">
              <div className="status-indicator status-booked"></div>
              <span>Booked: {bookedRooms}</span>
            </div>
            <div className="status-item">
              <div className="status-indicator status-maintenance"></div>
              <span>Maintenance: {rooms.filter(r => r.status === 'maintenance').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;