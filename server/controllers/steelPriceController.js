const SteelPrice = require('../models/SteelPrice');

// @desc    Get all steel prices
// @route   GET /api/steel-prices
// @access  Public
exports.getSteelPrices = async (req, res) => {
    try {
        const prices = await SteelPrice.find({}).sort({ thickness: 1 });
        res.json({ success: true, count: prices.length, data: prices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a new price tier
// @route   POST /api/steel-prices
// @access  Private/Admin
exports.addSteelPriceTier = async (req, res) => {
    try {
        const newTier = await SteelPrice.create(req.body);
        res.status(201).json({ success: true, data: newTier });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update a specific price tier
// @route   PUT /api/steel-prices/:id
// @access  Private/Admin
exports.updateSteelPriceTier = async (req, res) => {
    try {
        let priceTier = await SteelPrice.findById(req.params.id);

        if (!priceTier) {
            return res.status(404).json({ success: false, message: 'Price tier not found' });
        }

        // Add updatedAt timestamp
        req.body.updatedAt = Date.now();

        priceTier = await SteelPrice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: priceTier });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a price tier
// @route   DELETE /api/steel-prices/:id
// @access  Private/Admin
exports.deleteSteelPriceTier = async (req, res) => {
    try {
        const priceTier = await SteelPrice.findById(req.params.id);

        if (!priceTier) {
            return res.status(404).json({ success: false, message: 'Price tier not found' });
        }

        await priceTier.deleteOne();

        res.json({ success: true, message: 'Price tier removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Trigger manual sync with Metals API
// @route   POST /api/steel-prices/sync
// @access  Private/Admin
exports.syncWithMetalsApi = async (req, res) => {
    try {
        const updateSteelPrices = require('../jobs/updatePrices');
        await updateSteelPrices();
        res.json({ success: true, message: 'Pricing sync initiated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
