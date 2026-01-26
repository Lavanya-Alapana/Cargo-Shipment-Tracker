const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    createDriver,
    changePassword,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/create-driver', protect, authorize('ADMIN'), createDriver);
router.post('/change-password', protect, changePassword);

module.exports = router;
