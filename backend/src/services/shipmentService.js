const Shipment=require('../../models/shipment')
const {ApiError} =require('../../src/utils/apiResponse')
const haversineDistance = require("../utils/distance");

async function createShipment(payload) {  
  if (payload.origin && payload.originCoordinates) {
    payload.routes = [
      { location: payload.origin, coordinates: payload.originCoordinates, timestamp: new Date() }
    ];
  }

  const newShipment = await Shipment.create(payload);
  return newShipment;
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
  const shipment = await Shipment.findOne({ shipmentId: id });

   if (!shipment) {
    throw new ApiError(404, "Shipment not found");
  }
  if (!coordinates || typeof coordinates.lat !== "number" || typeof coordinates.lng !== "number") {
  throw new ApiError(400, "Invalid coordinates");
}


   shipment.routes.push({
    location,
    coordinates,
    updatedAt: new Date()
   })

   if (shipment.destinationCoordinates && coordinates) {
    const distance = await haversineDistance(coordinates, shipment.destinationCoordinates);
    const avgSpeed = 60; // km/h
    shipment.eta = new Date(Date.now() + (distance / avgSpeed) * 60 * 60 * 1000);
  }

   await shipment.save()

   return shipment

}


async function getETA(id) {
  const shipment = await Shipment.findById(id);
  if (!shipment) throw new ApiError(404, "Shipment not found");

  const current = shipment.routes && shipment.routes.length>0? shipment.routes[shipment.routes.length - 1] : null;
  const destination =
   shipment.destinationCoordinates ||null
      


  if (
    !current ||
    !current.coordinates ||
    !current.coordinates.lat ||
    !current.coordinates.lng ||
    !destination ||
    !destination.lat ||
    !destination.lng
  ) {
    shipment.eta = null; // fallback if coordinates missing
    await shipment.save();
    return shipment;
  }

  const distance = await haversineDistance(current.coordinates, destination);

  const avgSpeed = 60; // km/h
  const hours = distance / avgSpeed;
  shipment.eta = new Date(Date.now() + hours * 60 * 60 * 1000);

  await shipment.save();
  return shipment;
}


module.exports={createShipment,getShipments,getShipmentById,updateShipmentLocation,getETA}