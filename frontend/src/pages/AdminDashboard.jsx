import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRooms } from '../redux/slices/roomSlice';
import { getAllBookings } from '../redux/slices/bookingSlice';
import RoomManagement from '../components/admin/RoomManagement';
import BookingManagement from '../components/admin/BookingManagement';
import Analytics from '../components/admin/Analytics';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    // Load initial data
    dispatch(getAllRooms());
    dispatch(getAllBookings());
  }, [dispatch]);

  const tabs = [
    { id: 'analytics', label: 'Analytics', component: Analytics },
    { id: 'rooms', label: 'Room Management', component: RoomManagement },
    { id: 'bookings', label: 'Booking Management', component: BookingManagement },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}! Manage your hotel operations.</p>
        </div>

        <div className="dashboard-tabs">
          <div className="tab-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;