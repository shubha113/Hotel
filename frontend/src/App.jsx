import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './redux/slices/authSlice';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import RoomDetails from './pages/RoomDetails';

// Styles
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, profileLoading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch user profile only once on app load
    dispatch(getProfile());
  }, [dispatch]);

  // Loading spinner while the user profile is being fetched
  if (profileLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />

            {/* Public routes accessible only when not authenticated */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
            />

            {/* Private routes accessible only when authenticated */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />

            {/* Admin-only route */}
            <Route 
              path="/admin" 
              element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;