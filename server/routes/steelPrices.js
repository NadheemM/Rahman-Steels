const express = require('express');
const {
    getSteelPrices,
    addSteelPriceTier,
    updateSteelPriceTier,
    deleteSteelPriceTier,
    syncWithMetalsApi
} = require('../controllers/steelPriceController');

const router = express.Router();

const { protect, admin } = require('../middleware/auth');

router.post('/sync', protect, admin, syncWithMetalsApi);

router.route('/')
    .get(getSteelPrices)
    .post(protect, admin, addSteelPriceTier);

router.route('/:id')
    .put(protect, admin, updateSteelPriceTier)
    .delete(protect, admin, deleteSteelPriceTier);

module.exports = router;
