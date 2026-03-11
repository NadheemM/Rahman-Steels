const mongoose = require('mongoose');

const steelPriceSchema = new mongoose.Schema({
    thickness: {
        type: Number,
        required: [true, 'Please provide thickness in mm']
    },
    nominalWeight: {
        type: Number,
        required: [true, 'Please provide nominal weight in kg/m']
    },
    tolerance: {
        type: String, // e.g., '0.204-0.238'
        required: [true, 'Please provide tolerance range']
    },
    pricePerTon: {
        type: Number,
        required: [true, 'Please provide price per ton']
    },
    brand: {
        type: String,
        default: 'AGNI' // Based on the reference image
    },
    category: {
        type: String,
        default: 'TMT Bars' // To allow future expansion easily
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SteelPrice', steelPriceSchema);
