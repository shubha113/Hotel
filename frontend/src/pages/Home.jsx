// src/pages/Home.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRooms, clearError } from '../redux/slices/roomSlice';
import RoomList from '../components/rooms/RoomList';
import RoomFilter from '../components/rooms/RoomFilter';
import Loader from '../components/common/Loader';

const Home = () => {
  const dispatch = useDispatch();
  const { rooms, loading, error, totalCount } = useSelector((state) => state.rooms);
  
  // 🔑 The fix: Initialize with the full filter object structure
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    checkIn: '',
    checkOut: '',
  });
  
  const timeoutRef = useRef(null);

  const debouncedDispatch = useCallback((newFilters) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      dispatch(getAllRooms(newFilters));
    }, 500);
  }, [dispatch]);

  useEffect(() => {
    debouncedDispatch(filters);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      dispatch(clearError());
    };
  }, [debouncedDispatch, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <Loader text="Loading rooms..." />;
  }

  return (
    <div className="home-page">
      <div className="container">
        <section className="hero">
          <div className="hero-content">
            <h1>Find Your Perfect Stay</h1>
            <p>Discover comfortable rooms at unbeatable prices</p>
          </div>
        </section>

        <section className="filter-section">
          <RoomFilter filters={filters} onFilterChange={handleFilterChange} />
        </section>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        <section className="rooms-section">
          <div className="section-header">
            <h2>Available Rooms</h2>
            <span className="room-count">
              {totalCount} room{totalCount !== 1 ? 's' : ''} found
            </span>
          </div>
          
          {rooms.length > 0 ? (
            <RoomList rooms={rooms} />
          ) : (
            <div className="no-rooms">
              <h3>No rooms found</h3>
              <p>Try adjusting your search filters</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;