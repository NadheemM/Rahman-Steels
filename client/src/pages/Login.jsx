import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Send login request to backend
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            // Update auth context with token and user data
            login(response.data.user, response.data.token);

            console.log('Login Successful:', response.data);
            alert('Login Successful!');
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            console.error('Login Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="container login-container">
                <div className="login-card card glass">
                    <div className="login-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to your Rahman Steels account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-message" style={{color: '#e74c3c', marginBottom: '15px', padding: '10px', borderRadius: '4px', backgroundColor: '#fadbd8'}}>{error}</div>}
                        
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-icon-wrapper">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-icon-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/register">Create Account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
