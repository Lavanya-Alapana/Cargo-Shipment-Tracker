const {fetchShipments,fetchShipmentById,updateLocation, calculateETA, addShipment}=require('../controllers/shipmentController')
const {handler} =require('../controllers/geocodeController')
const express=require('express')
const router=express.Router()


router.post('/shipment',addShipment)
router.get('/shipments',fetchShipments)
router.get('/shipment/:id',fetchShipmentById)
router.post('/shipment/:id/update-location',updateLocation)
router.get('/shipment/:id/eta',calculateETA)


router.get("/geocode", handler);

module.exports=router