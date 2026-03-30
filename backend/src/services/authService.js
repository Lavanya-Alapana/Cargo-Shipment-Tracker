const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { ApiError } = require('../utils/apiResponse');
const { sendDriverCredentials } = require('./emailService');
const crypto = require('crypto');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
        throw new ApiError(400, 'Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new ApiError(400, 'User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: 'USER', // Default role for all registrations
    });

    if (user) {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        };
    } else {
        throw new ApiError(400, 'Invalid user data');
    }
};

const loginUser = async (loginData) => {
    const { email, password } = loginData;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
            token: generateToken(user._id),
        };
    } else {
        throw new ApiError(401, 'Invalid credentials');
    }
};

const createDriver = async (driverData) => {
    const { name, email } = driverData;

    if (!name || !email) {
        throw new ApiError(400, 'Please add name and email');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, 'User already exists');
    }

    // Generate random password
    const temporaryPassword = crypto.randomBytes(8).toString('hex');

    const user = await User.create({
        name,
        email,
        password: temporaryPassword,
        role: 'DRIVER',
        mustChangePassword: true,
    });

    if (user) {
        // Send email with credentials
        await sendDriverCredentials(email, temporaryPassword);

        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    } else {
        throw new ApiError(400, 'Invalid user data');
    }
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (!(await user.matchPassword(currentPassword))) {
        throw new ApiError(401, 'Invalid current password');
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    return {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    };
};

const getDrivers = async () => {
    const drivers = await User.find({ role: 'DRIVER' }).select('-password');
    return drivers;
};

module.exports = {
    registerUser,
    loginUser,
    createDriver,
    changePassword,
    getDrivers,
};
