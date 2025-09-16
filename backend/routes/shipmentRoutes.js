const {fetchShipments,fetchShipmentById,updateLocation, calculateETA, addShipment}=require('../controllers/shipmentController')

const express=require('express')
const router=express.Router()


router.post('/shipment',addShipment)
router.get('/shipments',fetchShipments)
router.get('/shipment/:id',fetchShipmentById)
router.post('/shipment/:id/update-location',updateLocation)
router.get('/shipment/:id/eta',calculateETA)

module.exports=router