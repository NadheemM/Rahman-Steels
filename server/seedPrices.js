const mongoose = require('mongoose');
require('dotenv').config();
const SteelPrice = require('./models/SteelPrice');

const initialPrices = [
    { thickness: 6, nominalWeight: 0.222, tolerance: '0.204-0.238', pricePerTon: 79340 },
    { thickness: 8, nominalWeight: 0.395, tolerance: '0.363-0.423', pricePerTon: 76340 },
    { thickness: 10, nominalWeight: 0.617, tolerance: '0.567-0.660', pricePerTon: 75140 },
    { thickness: 12, nominalWeight: 0.888, tolerance: '0.834-0.932', pricePerTon: 75140 },
    { thickness: 16, nominalWeight: 1.580, tolerance: '1.485-1.658', pricePerTon: 75140 },
    { thickness: 20, nominalWeight: 2.470, tolerance: '2.371-2.541', pricePerTon: 75140 },
    { thickness: 25, nominalWeight: 3.850, tolerance: '3.696-3.971', pricePerTon: 75140 },
    { thickness: 32, nominalWeight: 6.310, tolerance: '6.121-6.500', pricePerTon: 76340 }
];

const seedPrices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing prices
        await SteelPrice.deleteMany();
        console.log('Existing prices cleared.');

        // Insert new prices
        await SteelPrice.insertMany(initialPrices);
        console.log('Steel Prices seeded successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding steel prices:', error);
        process.exit(1);
    }
};

seedPrices();
