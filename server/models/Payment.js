const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true,
        unique: true
    },
    razorpay_payment_id: {
        type: String,
        default: null
    },
    razorpay_signature: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['created', 'failed', 'captured'],
        default: 'created'
    },
    paymentMethod: {
        type: String,
        default: 'razorpay'
    },
    cartItems: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    shippingAddress: {
        name: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        state: String,
        zipCode: String
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    failureReason: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
