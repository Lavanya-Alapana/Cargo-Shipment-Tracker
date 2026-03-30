const express = require('express');
const router = express.Router();
const { createContainer, getContainers, updateContainerLocation } = require('../controllers/containerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/container', protect, authorize('ADMIN'), createContainer);
router.get('/containers', protect, authorize('ADMIN', 'DRIVER'), getContainers);
router.post('/container/:id/update', protect, authorize('DRIVER'), updateContainerLocation);

module.exports = router;
