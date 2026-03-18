import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCity } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart, cartTotal } = useCart();
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [shippingAddress, setShippingAddress] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress({
            ...shippingAddress,
            [name]: value
        });
        setError('');
    };

    // Validate form
    const validateForm = () => {
        if (!shippingAddress.phone || !shippingAddress.address || 
            !shippingAddress.city || !shippingAddress.state || 
            !shippingAddress.zipCode) {
            setError('Please fill all shipping details');
            return false;
        }
        if (!/^\d{10}$/.test(shippingAddress.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        if (cart.length === 0) {
            setError('Your cart is empty');
            return false;
        }
        return true;
    };

    // Handle payment
    const handlePayment = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            // Step 1: Create order on backend
            const orderResponse = await axios.post(
                'http://localhost:5000/api/payments/create-order',
                {
                    amount: cartTotal,
                    currency: 'INR',
                    cartItems: cart,
                    shippingAddress: shippingAddress
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message);
            }

            // Step 2: Load Razorpay script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.head.appendChild(script);

            // Step 3: Configure Razorpay options
            script.onload = () => {
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY',
                    amount: orderResponse.data.amount,
                    currency: orderResponse.data.currency,
                    order_id: orderResponse.data.order_id,
                    name: 'Rahman Steels',
                    description: 'Premium Steel Products',
                    image: '/logo.png',
                    handler: async (response) => {
                        try {
                            // Step 4: Verify payment on backend
                            const verifyResponse = await axios.post(
                                'http://localhost:5000/api/payments/verify-payment',
                                {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                    }
                                }
                            );

                            if (verifyResponse.data.success) {
                                // Clear cart and navigate to success page
                                clearCart();
                                navigate('/payment-success', {
                                    state: {
                                        orderId: response.razorpay_order_id,
                                        paymentId: response.razorpay_payment_id,
                                        amount: cartTotal
                                    }
                                });
                            } else {
                                setError('Payment verification failed');
                            }
                        } catch (err) {
                            setError(err.response?.data?.message || 'Payment verification failed');
                        }
                    },
                    prefill: {
                        name: shippingAddress.name,
                        email: shippingAddress.email,
                        contact: shippingAddress.phone
                    },
                    notes: {
                        address: shippingAddress.address,
                        city: shippingAddress.city,
                        state: shippingAddress.state,
                        zipCode: shippingAddress.zipCode
                    },
                    theme: {
                        color: '#0369a1'
                    },
                    modal: {
                        ondismiss: () => {
                            setLoading(false);
                            setError('Payment cancelled');
                        }
                    }
                };

                // Open Razorpay checkout
                const razorpay = new window.Razorpay(options);
                razorpay.on('payment.failed', (response) => {
                    setError('Payment failed: ' + (response.error.description || 'Unknown error'));
                    setLoading(false);
                });
                razorpay.open();
            };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-container">
                <div className="empty-cart-message">
                    <h2>Your cart is empty</h2>
                    <p>Please add items before checkout</p>
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-wrapper">
                <div className="checkout-main">
                    <h1>Checkout</h1>

                    {error && <div className="error-banner">{error}</div>}

                    <form onSubmit={handlePayment} className="checkout-form">
                        <div className="form-section">
                            <h2>Shipping Address</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={shippingAddress.name}
                                        onChange={handleInputChange}
                                        readOnly
                                        className="readonly-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={shippingAddress.email}
                                        onChange={handleInputChange}
                                        readOnly
                                        className="readonly-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">
                                    <FaPhone /> Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="10-digit phone number"
                                    value={shippingAddress.phone}
                                    onChange={handleInputChange}
                                    maxLength="10"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">
                                    <FaMapMarkerAlt /> Address *
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    placeholder="Street address"
                                    value={shippingAddress.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">
                                        <FaCity /> City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder="City"
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State *</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        placeholder="State"
                                        value={shippingAddress.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="zipCode">Zip Code *</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        placeholder="Zip code"
                                        value={shippingAddress.zipCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-large"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="checkout-sidebar">
                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="items-list">
                            {cart.map((item) => (
                                <div key={item.id} className="item-row">
                                    <div className="item-info">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-qty">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span className="free">Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
