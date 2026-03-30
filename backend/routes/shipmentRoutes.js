const { fetchShipments, fetchShipmentById, updateLocation, calculateETA, addShipment } = require('../controllers/shipmentController')
const { handler } = require('../controllers/geocodeController')
const express = require('express')
const router = express.Router()

const { protect, authorize } = require('../middleware/authMiddleware')

router.post('/shipment', protect, addShipment)
router.get('/shipments', protect, fetchShipments)
router.get('/shipment/:id', protect, fetchShipmentById)
router.post('/shipment/:id/update-location', protect, authorize('ADMIN', 'DRIVER'), updateLocation)
router.get('/shipment/:id/eta', calculateETA)


router.get("/geocode", handler);

module.exports = router