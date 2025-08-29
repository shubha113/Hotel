import React, { useState } from 'react';

const BookingForm = ({ onSubmit, onCancel, loading, room }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    checkIn: '',
    checkOut: '',
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalNights, setTotalNights] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Calculate total when dates change
    if (name === 'checkIn' || name === 'checkOut') {
      const newFormData = { ...formData, [name]: value };
      calculateTotal(newFormData);
    }
  };

  const calculateTotal = (data) => {
    if (data.checkIn && data.checkOut) {
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      
      if (checkOutDate > checkInDate) {
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const amount = nights * room.price;
        setTotalNights(nights);
        setTotalAmount(amount);
      } else {
        setTotalNights(0);
        setTotalAmount(0);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
      alert('Please fill in all required fields');
      return;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const currentDate = new Date();

    if (checkInDate < currentDate) {
      alert('Check-in date cannot be in the past');
      return;
    }

    if (checkOutDate <= checkInDate) {
      alert('Check-out date must be after check-in date');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="booking-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guestName">Guest Name *</label>
          <input
            type="text"
            id="guestName"
            name="guestName"
            value={formData.guestName}
            onChange={handleInputChange}
            required
            placeholder="Enter guest name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="guestEmail">Guest Email *</label>
          <input
            type="email"
            id="guestEmail"
            name="guestEmail"
            value={formData.guestEmail}
            onChange={handleInputChange}
            required
            placeholder="Enter guest email"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="checkIn">Check-in Date *</label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="checkOut">Check-out Date *</label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleInputChange}
              required
              min={formData.checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {totalNights > 0 && (
          <div className="booking-summary">
            <h4>Booking Summary</h4>
            <div className="summary-item">
              <span>Room {room.number} - {room.type}</span>
            </div>
            <div className="summary-item">
              <span>{totalNights} night{totalNights > 1 ? 's' : ''}</span>
              <span>${room.price} × {totalNights}</span>
            </div>
            <div className="summary-total">
              <span>Total Amount: <strong>${totalAmount}</strong></span>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || totalAmount === 0}
          >
            {loading ? 'Booking...' : `Book for $${totalAmount}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;