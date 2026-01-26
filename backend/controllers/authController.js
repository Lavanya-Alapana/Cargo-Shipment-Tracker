const { asyncHandler } = require('../src/utils/asyncHandler');
const authService = require('../src/services/authService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const userData = await authService.registerUser(req.body);
    res.status(201).json(userData);
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const userData = await authService.loginUser(req.body);
    res.json(userData);
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Create driver (Admin only)
// @route   POST /api/auth/create-driver
// @access  Private (Admin)
const createDriver = asyncHandler(async (req, res) => {
    const driverData = await authService.createDriver(req.body);
    res.status(201).json(driverData);
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userData = await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json(userData);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    createDriver,
    changePassword,
};
