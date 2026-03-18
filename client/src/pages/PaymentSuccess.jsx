import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaPrint } from 'react-icons/fa';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;

    useEffect(() => {
        if (!state) {
            navigate('/cart');
        }
    }, [state, navigate]);

    const handlePrint = () => {
        window.print();
    };

    if (!state) {
        return null;
    }

    return (
        <div className="payment-success-container">
            <div className="success-content">
                <div className="success-icon">
                    <FaCheckCircle />
                </div>

                <h1>Payment Successful!</h1>
                <p className="message">Thank you for your purchase</p>

                <div className="order-details">
                    <div className="detail-row">
                        <span className="label">Order ID:</span>
                        <span className="value font-mono">{state.orderId}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Payment ID:</span>
                        <span className="value font-mono">{state.paymentId}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Amount Paid:</span>
                        <span className="value amount">₹{state.amount?.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Payment Status:</span>
                        <span className="value status-paid">Completed</span>
                    </div>
                </div>

                <div className="success-message">
                    <p>
                        🎉 Your order has been placed successfully! You will receive an email confirmation shortly.
                    </p>
                    <p>
                        Our team will process your order and contact you with delivery details.
                    </p>
                </div>

                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                    <button className="btn btn-secondary" onClick={handlePrint}>
                        <FaPrint /> Print Receipt
                    </button>
                </div>

                <div className="invoice-section">
                    <h3>Order Receipt</h3>
                    <div className="receipt-details">
                        <p><strong>Order Confirmation</strong></p>
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <p>Time: {new Date().toLocaleTimeString()}</p>
                        <p className="mt-20">
                            Your order has been confirmed. Transaction ID: <code>{state.paymentId}</code>
                        </p>
                        <p className="mt-20 text-sm">
                            Please keep this receipt for your records. You will receive a tracking number via email once your order ships.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
