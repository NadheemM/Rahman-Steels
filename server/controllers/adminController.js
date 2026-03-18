const Payment = require('../models/Payment');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        // Total orders (only captured ones indicate actual sales, but we can count all or captured)
        const totalOrdersCount = await Payment.countDocuments({});
        
        // Total Revenue (only captured payments)
        const payments = await Payment.find({ status: 'captured' });
        const totalRevenue = payments.reduce((acc, order) => acc + order.amount, 0);

        // Inventory Status ( total products vs out of stock )
        const totalProducts = await Product.countDocuments({});
        const outOfStockProducts = await Product.countDocuments({ inStock: false });

        return res.status(200).json({
            success: true,
            data: {
                totalOrders: totalOrdersCount,
                totalRevenue: totalRevenue,
                totalProducts: totalProducts,
                outOfStock: outOfStockProducts
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
