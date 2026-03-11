const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const products = [
    {
        name: 'Tata Tiscon TMT Bar Fe 550D',
        category: 'TMT Bars',
        price: 65,
        image: '/images/tmt-bars.png',
        description: 'High-strength ribbed TMT bars for earthquake-resistant structures.',
        inStock: true
    },
    {
        name: 'JSW Neosteel Rods',
        category: 'TMT Bars',
        price: 62,
        image: '/images/tmt-bars.png',
        description: 'Premium TMT rods with superior ductility and weldability.',
        inStock: true
    },
    {
        name: 'APL Apollo Steel Pipe',
        category: 'Steel Pipes',
        price: 58,
        image: '/images/steel-pipes.png',
        description: 'Galvanized round pipes for water transport and structural use.',
        inStock: true
    },
    {
        name: 'Jindal Square Hollow Section',
        category: 'Steel Pipes',
        price: 60,
        image: '/images/steel-pipes.png',
        description: 'Square hollow sections for industrial fabrication.',
        inStock: true
    },
    {
        name: 'Galvanized Plain Sheet (GP)',
        category: 'Sheets & Coils',
        price: 75,
        image: '/images/metal-sheets.png',
        description: 'Corrosion-resistant plain sheets for roofing and paneling.',
        inStock: true
    },
    {
        name: 'HR/CR Coils',
        category: 'Sheets & Coils',
        price: 70,
        image: '/images/metal-sheets.png',
        description: 'Hot rolled and cold rolled coils for automobile and manufacturing.',
        inStock: true
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany();
        console.log('Existing products cleared.');

        // Insert new products
        await Product.insertMany(products);
        console.log('Products seeded successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
