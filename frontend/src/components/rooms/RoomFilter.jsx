// src/components/rooms/RoomFilter.jsx
import React from 'react';

const RoomFilter = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      type: '',
      minPrice: '',
      maxPrice: '',
      checkIn: '',
      checkOut: '',
    };
    onFilterChange(clearedFilters);
  };

  return (
    <div className="room-filter">
      <div className="filter-title">
        <h3>Filter Rooms</h3>
      </div>
      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="type">Room Type</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleInputChange}
          >
            <option value="">All Types</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="minPrice">Min Price ($)</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="Min"
            min="0"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Max Price ($)</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
            placeholder="Max"
            min="0"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="checkIn">Check-in Date</label>
          <input
            type="date"
            id="checkIn"
            name="checkIn"
            value={filters.checkIn}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="checkOut">Check-out Date</label>
          <input
            type="date"
            id="checkOut"
            name="checkOut"
            value={filters.checkOut}
            onChange={handleInputChange}
            min={filters.checkIn || new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="filter-actions">
          <button
            type="button"
            onClick={handleClearFilters}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;