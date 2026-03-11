const express = require('express');
const {
    getSteelPrices,
    addSteelPriceTier,
    updateSteelPriceTier,
    deleteSteelPriceTier
} = require('../controllers/steelPriceController');

const router = express.Router();

const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(getSteelPrices)
    .post(protect, admin, addSteelPriceTier);

router.route('/:id')
    .put(protect, admin, updateSteelPriceTier)
    .delete(protect, admin, deleteSteelPriceTier);

module.exports = router;
