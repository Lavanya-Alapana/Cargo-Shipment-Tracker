const Shipment=require('../../models/shipment')
const {ApiError} =require('../../src/utils/apiResponse')
const haversineDistance = require("../utils/distance");


async function createShipment(payload)
{  
  
  if(!payload.currentLocation && payload.origin)
  {
        payload.currentLocation = { location: payload.origin, coordinates: {}, updatedAt: new Date() };
  }


  const newshipment=await Shipment.create(payload)

 
  return newshipment
}
async function getShipments()
{
    const shipmentAll=await Shipment.find()
    return shipmentAll
}

async function getShipmentById(id)
{
    const shipment=await Shipment.findById(id)
    if (!shipment) {
    throw new ApiError(404, "Product not found");
  }

  return shipment
}

async function updateShipmentLocation(id,location,coordinates)
{
   const shipment=await Shipment.findById(id)
   if (!shipment) {
    throw new ApiError(404, "Shipment not found");
  }

   shipment.currentLocation={
    location,
    coordinates,
    updatedAt: new Date()
   }

   await shipment.save()

   return shipment

}


async function getETA(id) {
  const shipment = await Shipment.findById(id);
  if (!shipment) throw new ApiError(404, "Shipment not found");

  const current = shipment.currentLocation;
  const destination =
    shipment.routes && shipment.routes.length > 0
      ? shipment.routes[shipment.routes.length - 1]
      : null;


  if (
    !current ||
    !current.coordinates ||
    !current.coordinates.lat ||
    !current.coordinates.lng ||
    !destination ||
    !destination.coordinates ||
    !destination.coordinates.lat ||
    !destination.coordinates.lng
  ) {
    shipment.eta = null; // fallback if coordinates missing
    await shipment.save();
    return shipment;
  }

  const distance = await haversineDistance(current.coordinates, destination.coordinates);

  const avgSpeed = 60; // km/h
  const hours = distance / avgSpeed;
  shipment.eta = new Date(Date.now() + hours * 60 * 60 * 1000);

  await shipment.save();
  return shipment;
}


module.exports={createShipment,getShipments,getShipmentById,updateShipmentLocation,getETA}