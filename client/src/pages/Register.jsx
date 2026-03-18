import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Send register request to backend
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            // Update auth context with token and user data
            login(response.data.user, response.data.token);

            console.log('Registration Successful:', response.data);
            alert('Account created successfully!');
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Registration Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="container login-container">
                <div className="login-card card glass">
                    <div className="login-header">
                        <h2>Create Account</h2>
                        <p>Join Rahman Steels today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-message" style={{color: '#e74c3c', marginBottom: '15px', padding: '10px', borderRadius: '4px', backgroundColor: '#fadbd8'}}>{error}</div>}
                        
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-icon-wrapper">
                                <FaUser className="input-icon" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Enter your password (min 6 characters)"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-icon-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
