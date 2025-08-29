import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, clearMessage } from '../redux/slices/authSlice';
import Loader from '../components/common/Loader';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const {email, password} = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({
        email,
        password,
      })).unwrap();
      
      // Login successful, redirect to home
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      // Error is handled by Redux
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Login</h2>
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            
            {message && (
              <div className="success-message">
                <p>{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password (min 6 characters)"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? <Loader size="small" text="" /> : 'Login'}
              </button>
            </form>

            <div className="auth-links">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="link">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;