import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaCreditCard, FaLock, FaArrowLeft } from 'react-icons/fa';
import './Payment.css';

const Payment = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [formData, setFormData] = useState({
        // Customer Info
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        // Card Info
        cardholderName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });
    
    const [formErrors, setFormErrors] = useState({});

    const gstRate = 0.18;
    const gstAmount = cartTotal * gstRate;
    const grandTotal = cartTotal + gstAmount;

    // Validate form fields
    const validateForm = () => {
        const errors = {};
        
        // Customer info validation
        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!formData.phone.trim()) errors.phone = 'Phone is required';
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.state.trim()) errors.state = 'State is required';
        if (!formData.zipCode.trim()) errors.zipCode = 'Zip code is required';

        // Card info validation (only for credit/debit card)
        if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
            if (!formData.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
            
            const cardNum = formData.cardNumber.replace(/\s/g, '');
            if (!cardNum || cardNum.length < 13 || cardNum.length > 19) {
                errors.cardNumber = 'Valid card number required (13-19 digits)';
            }
            
            if (!formData.expiry.match(/^\d{2}\/\d{2}$/)) {
                errors.expiry = 'Expiry date required (MM/YY)';
            }
            
            if (!formData.cvv.match(/^\d{3,4}$/)) {
                errors.cvv = 'Valid CVV required (3-4 digits)';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const formatCardNumber = (value) => {
        // Remove spaces and keep only digits
        const digits = value.replace(/\D/g, '');
        // Add space every 4 digits
        return digits.replace(/(\d{4})/g, '$1 ').trim();
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setFormData(prev => ({
            ...prev,
            cardNumber: formatted
        }));
        if (formErrors.cardNumber) {
            setFormErrors(prev => ({
                ...prev,
                cardNumber: ''
            }));
        }
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        setFormData(prev => ({
            ...prev,
            expiry: value
        }));
        if (formErrors.expiry) {
            setFormErrors(prev => ({
                ...prev,
                expiry: ''
            }));
        }
    };

    const handleCVVChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setFormData(prev => ({
            ...prev,
            cvv: value
        }));
        if (formErrors.cvv) {
            setFormErrors(prev => ({
                ...prev,
                cvv: ''
            }));
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Check if it's COD
            if (paymentMethod === 'cod') {
                const codRes = await axios.post('http://localhost:5000/api/payments/create-cod-order', {
                    amount: grandTotal,
                    cartItems: cart,
                    shippingAddress: {
                        name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode
                    }
                }, { headers: { Authorization: `Bearer ${token}` } });

                if (codRes.data.success) {
                    clearCart();
                    navigate('/payment-success', {
                        state: {
                            orderId: codRes.data.order_id,
                            paymentId: 'CASH_ON_DELIVERY',
                            amount: grandTotal,
                            customerName: formData.fullName,
                            paymentMethod: 'Cash on Delivery'
                        }
                    });
                }
                return; // Stop here for COD
            }

            // Otherwise, it's Razorpay online payment
            // 1. Create order on backend
            const orderRes = await axios.post('http://localhost:5000/api/payments/create-order', {
                amount: grandTotal,
                cartItems: cart,
                shippingAddress: {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode
                }
            }, { headers: { Authorization: `Bearer ${token}` } });

            const orderData = orderRes.data;

            // 2. Load Razorpay script (or simulate if script fails)
            const scriptLoaded = await loadRazorpayScript();
            
            if (!scriptLoaded) {
                // Fallback simulation if razorpay blocks/fails to load
                setTimeout(() => {
                    clearCart();
                    navigate('/payment-success', {
                        state: {
                            orderId: orderData.order_id,
                            paymentId: `PAY-SIMULATED-${Date.now()}`,
                            amount: grandTotal,
                            customerName: formData.fullName,
                            paymentMethod: paymentMethod
                        }
                    });
                }, 1000);
                return;
            }

            // 3. Open Razorpay Checkout
            const options = {
                key: 'rzp_test_SNrsGC564s5umv', // Will normally come from backend
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Rahman Iron & Steel',
                description: 'Purchase Payment',
                order_id: orderData.order_id,
                handler: async function (response) {
                    // 4. Verify Payment on Backend
                    try {
                        const verifyRes = await axios.post('http://localhost:5000/api/payments/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, { headers: { Authorization: `Bearer ${token}` } });

                        if (verifyRes.data.success) {
                            clearCart();
                            navigate('/payment-success', {
                                state: {
                                    orderId: response.razorpay_order_id,
                                    paymentId: response.razorpay_payment_id,
                                    amount: grandTotal,
                                    customerName: formData.fullName,
                                    paymentMethod: paymentMethod
                                }
                            });
                        }
                    } catch (verifyError) {
                        alert('Payment Verification Failed!');
                        setLoading(false);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: '#2563eb'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert('Payment failed: ' + response.error.description);
                setLoading(false);
            });
            rzp.open();

        } catch (error) {
            console.error('Payment error:', error);
            alert('Something went wrong. ' + (error.response?.data?.message || ''));
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container empty-cart">
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/products')} className="btn btn-primary">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="container payment-container">
                <button onClick={() => navigate('/cart')} className="back-btn">
                    <FaArrowLeft /> Back to Cart
                </button>

                <h1 className="page-title">Checkout</h1>

                <div className="payment-content">
                    {/* Left Side - Form */}
                    <div className="payment-form-section">
                        <form onSubmit={handleSubmit} className="payment-form">
                            {/* Customer Information */}
                            <div className="form-section">
                                <h2>Customer Information</h2>
                                
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name *</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={formErrors.fullName ? 'input-error' : ''}
                                        placeholder="John Doe"
                                    />
                                    {formErrors.fullName && <span className="error-msg">{formErrors.fullName}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={formErrors.email ? 'input-error' : ''}
                                            placeholder="john@example.com"
                                        />
                                        {formErrors.email && <span className="error-msg">{formErrors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={formErrors.phone ? 'input-error' : ''}
                                            placeholder="+91 9876543210"
                                        />
                                        {formErrors.phone && <span className="error-msg">{formErrors.phone}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address">Address *</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={formErrors.address ? 'input-error' : ''}
                                        placeholder="123 Main Street"
                                    />
                                    {formErrors.address && <span className="error-msg">{formErrors.address}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">City *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={formErrors.city ? 'input-error' : ''}
                                            placeholder="New York"
                                        />
                                        {formErrors.city && <span className="error-msg">{formErrors.city}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="state">State *</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={formErrors.state ? 'input-error' : ''}
                                            placeholder="NY"
                                        />
                                        {formErrors.state && <span className="error-msg">{formErrors.state}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="zipCode">Zip Code *</label>
                                        <input
                                            type="text"
                                            id="zipCode"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className={formErrors.zipCode ? 'input-error' : ''}
                                            placeholder="10001"
                                        />
                                        {formErrors.zipCode && <span className="error-msg">{formErrors.zipCode}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="form-section">
                                <h2>Payment Method</h2>
                                
                                <div className="payment-methods">
                                    <label className="method-option">
                                        <input
                                            type="radio"
                                            value="credit_card"
                                            checked={paymentMethod === 'credit_card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="method-label">Credit Card</span>
                                    </label>

                                    <label className="method-option">
                                        <input
                                            type="radio"
                                            value="debit_card"
                                            checked={paymentMethod === 'debit_card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="method-label">Debit Card</span>
                                    </label>

                                    <label className="method-option">
                                        <input
                                            type="radio"
                                            value="upi"
                                            checked={paymentMethod === 'upi'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="method-label">UPI</span>
                                    </label>

                                    <label className="method-option">
                                        <input
                                            type="radio"
                                            value="net_banking"
                                            checked={paymentMethod === 'net_banking'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="method-label">Net Banking</span>
                                    </label>

                                    <label className="method-option">
                                        <input
                                            type="radio"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span className="method-label">Cash on Delivery (COD)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Card Details - Only show for card payments */}
                            {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                                <div className="form-section">
                                    <h2>Card Details</h2>

                                    <div className="form-group">
                                        <label htmlFor="cardholderName">Cardholder Name *</label>
                                        <input
                                            type="text"
                                            id="cardholderName"
                                            name="cardholderName"
                                            value={formData.cardholderName}
                                            onChange={handleInputChange}
                                            className={formErrors.cardholderName ? 'input-error' : ''}
                                            placeholder="John Doe"
                                        />
                                        {formErrors.cardholderName && <span className="error-msg">{formErrors.cardholderName}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="cardNumber">Card Number *</label>
                                        <div className="input-with-icon">
                                            <FaCreditCard className="icon" />
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleCardNumberChange}
                                                className={formErrors.cardNumber ? 'input-error' : ''}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                            />
                                        </div>
                                        {formErrors.cardNumber && <span className="error-msg">{formErrors.cardNumber}</span>}
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="expiry">Expiry Date * (MM/YY)</label>
                                            <input
                                                type="text"
                                                id="expiry"
                                                name="expiry"
                                                value={formData.expiry}
                                                onChange={handleExpiryChange}
                                                className={formErrors.expiry ? 'input-error' : ''}
                                                placeholder="12/25"
                                                maxLength="5"
                                            />
                                            {formErrors.expiry && <span className="error-msg">{formErrors.expiry}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="cvv">
                                                CVV * <FaLock size={12} />
                                            </label>
                                            <input
                                                type="password"
                                                id="cvv"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleCVVChange}
                                                className={formErrors.cvv ? 'input-error' : ''}
                                                placeholder="123"
                                                maxLength="4"
                                            />
                                            {formErrors.cvv && <span className="error-msg">{formErrors.cvv}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={`btn btn-primary submit-btn ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Complete Payment'}
                            </button>
                        </form>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="order-summary-section">
                        <div className="order-summary card">
                            <h2>Order Summary</h2>

                            <div className="summary-items">
                                {cart.map((item) => (
                                    <div key={item.id} className="summary-item">
                                        <div className="item-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty">x{item.quantity}</span>
                                        </div>
                                        <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>GST (18%)</span>
                                    <span>₹{gstAmount.toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <strong>Total</strong>
                                    <strong>₹{grandTotal.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="security-badge">
                                <FaLock /> Secure Payment
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
