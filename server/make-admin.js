const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        if (users.length > 0) {
            const firstUser = users[0];
            firstUser.role = 'admin';
            await firstUser.save();
            console.log(`User ${firstUser.email} is now an admin.`);
        } else {
            console.log('No users found. Please register a user first.');
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

makeAdmin();
