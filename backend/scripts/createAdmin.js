const mongoose = require('mongoose');
const User = require('../models/user');
const { MONGODB_URL } = require('../src/config/config');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log('MongoDB Connected');

        const email = process.env.ADMIN_EMAIL || 'admin@example.com';
        const password = process.env.ADMIN_PASSWORD || 'admin123';

        const adminExists = await User.findOne({ email });

        if (adminExists) {
            console.log('Admin user already exists. Updating password...');
            adminExists.password = password;
            await adminExists.save();
            console.log('Admin password updated successfully.');
            process.exit(0);
        }

        await User.create({
            name: 'Admin User',
            email,
            password,
            role: 'ADMIN',
        });

        console.log('Admin user created successfully.');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
