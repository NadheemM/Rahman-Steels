const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');

// Initialize Razorpay instance with error handling
let razorpayInstance;

try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && 
        !process.env.RAZORPAY_KEY_ID.includes('your_') && 
        !process.env.RAZORPAY_KEY_SECRET.includes('your_')) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    } else {
        console.warn('Razorpay API keys not configured. Payment functionality will be limited.');
    }
} catch (error) {
    console.warn('Failed to initialize Razorpay:', error.message);
}

// Create Razorpay Order
exports.createOrder = async (req, res) => {
    try {
        const { amount, cartItems, shippingAddress, currency = 'INR' } = req.body;
        const userId = req.userId;

        // Validate inputs
        if (!amount || !cartItems || !shippingAddress) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Check if Razorpay is initialized
        if (!razorpayInstance) {
            return res.status(500).json({ 
                success: false, 
                message: 'Payment service is not configured. Please contact support.' 
            });
        }

        // Amount should be in paise for Razorpay
        const amountInPaise = Math.round(amount * 100);

        // Create order with Razorpay
        const options = {
            amount: amountInPaise,
            currency: currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // Auto-capture payment
        };

        const order = await razorpayInstance.orders.create(options);

        // Save payment record in database
        const payment = new Payment({
            user: userId,
            razorpay_order_id: order.id,
            amount: amount,
            currency: currency,
            status: 'created',
            paymentMethod: 'razorpay',
            cartItems: cartItems,
            shippingAddress: shippingAddress
        });

        await payment.save();

        return res.status(200).json({
            success: true,
            order_id: order.id,
            amount: amountInPaise,
            currency: currency,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.userId;

        // Validate inputs
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing payment details' 
            });
        }

        // Check if Razorpay is configured
        if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes('your_')) {
            return res.status(500).json({ 
                success: false, 
                message: 'Payment service is not configured.' 
            });
        }

        // Verify signature
        const signBody = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(signBody)
            .digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (!isSignatureValid) {
            // Update payment status to failed
            const payment = await Payment.findOne({ razorpay_order_id });
            if (payment) {
                payment.status = 'failed';
                payment.failureReason = 'Invalid signature';
                await payment.save();
            }

            return res.status(400).json({ 
                success: false, 
                message: 'Payment verification failed' 
            });
        }

        // Update payment status to captured
        const payment = await Payment.findOne({ razorpay_order_id });
        if (payment) {
            payment.razorpay_payment_id = razorpay_payment_id;
            payment.razorpay_signature = razorpay_signature;
            payment.status = 'captured';
            await payment.save();
        } else {
            return res.status(404).json({ 
                success: false, 
                message: 'Payment record not found' 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Payment verified and captured successfully',
            payment: {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                status: 'captured'
            }
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Payment Details
exports.getPaymentDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.userId;

        const payment = await Payment.findOne({
            razorpay_order_id: orderId,
            user: userId
        });

        if (!payment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Payment not found' 
            });
        }

        return res.status(200).json({
            success: true,
            payment: payment
        });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Payments for User
exports.getUserPayments = async (req, res) => {
    try {
        const userId = req.userId;

        const payments = await Payment.find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            payments: payments
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Payment.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid order status' });
        }

        const order = await Payment.findById(id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.orderStatus = orderStatus;
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Create Cash On Delivery (COD) Order
exports.createCodOrder = async (req, res) => {
    try {
        const { amount, cartItems, shippingAddress } = req.body;
        const userId = req.userId;

        if (!amount || !cartItems || !shippingAddress) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const orderId = `COD_${Date.now()}`;

        const payment = new Payment({
            user: userId,
            razorpay_order_id: orderId, // using this field as universal order ID
            razorpay_payment_id: 'CASH_ON_DELIVERY',
            amount: amount,
            currency: 'INR',
            status: 'captured', // COD orders are fundamentally confirmed internally
            paymentMethod: 'cod',
            cartItems: cartItems,
            shippingAddress: shippingAddress
        });

        await payment.save();

        return res.status(200).json({
            success: true,
            order_id: orderId,
            message: 'COD Order created successfully'
        });
    } catch (error) {
        console.error('Error creating COD order:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
