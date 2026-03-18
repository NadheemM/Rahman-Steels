const express = require('express');
const { 
    createOrder, 
    createCodOrder,
    verifyPayment, 
    getPaymentDetails, 
    getUserPayments 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/create-order', protect, createOrder);

// Create COD order
router.post('/create-cod-order', protect, createCodOrder);

// Verify payment
router.post('/verify-payment', protect, verifyPayment);

// Get payment details
router.get('/details/:orderId', protect, getPaymentDetails);

// Get user payments
router.get('/user-payments', protect, getUserPayments);

// Admin routes
const { getAllOrders, updateOrderStatus } = require('../controllers/paymentController');
const { admin } = require('../middleware/auth');

router.get('/admin/all', protect, admin, getAllOrders);
router.put('/admin/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
