const shipmentService = require('../src/services/shipmentService');
const { asyncHandler } = require('../src/utils/asyncHandler');
const {successResponse }= require('../src/utils/apiResponse');
const logger = require('../src/utils/logger');

const addShipment = asyncHandler(async (req, res) => {
  const { containerId, shipmentId, origin, destination, status, routes,originCoordinates, destinationCoordinates } = req.body;
  const shipment = await shipmentService.createShipment({
    containerId, shipmentId, origin, destination, status,originCoordinates, destinationCoordinates,routes: originCoordinates
      ? [{ location: origin, coordinates: originCoordinates, timestamp: new Date() }]
      : []
  });

  logger.info(`New shipment created: ${shipmentId} from ${origin} to ${destination}`);
  return successResponse(res, 201, "Shipment created successfully", { shipment });
});

const fetchShipments = asyncHandler(async (req, res) => {
  const shipments = await shipmentService.getShipments();
  const message = shipments.length == 0 ? "No shipment found" : "Shipments fetched successfully";

  logger.info(`Fetched ${shipments.length} shipments`);
  return successResponse(res, 200, message, { shipments });
});

const fetchShipmentById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const shipment = await shipmentService.getShipmentById(id);
  const message = shipment ? "Shipment fetched successfully" : "Shipment not found";

  logger.info(`Fetch shipment by ID: ${id} - ${message}`);
  return successResponse(res, 200, message, { shipment });
});

const updateLocation = asyncHandler(async (req, res) => {
  const { location, coordinates } = req.body;
  const { id } = req.params;

  const updatedShipment = await shipmentService.updateShipmentLocation(id, location, coordinates);
  const message = updatedShipment ? "Shipment location updated successfully" : "Shipment not found";

  logger.info(`Update location for shipment ID: ${id} - ${message}`);
  return successResponse(res, 200, message, { updatedShipment });
});

const calculateETA = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const shipment = await shipmentService.getETA(id);

  logger.info(`ETA calculated for shipment ID: ${id}`);
  return successResponse(res, 200, "ETA calculated", {eta: shipment.eta });
});

module.exports = { fetchShipments, fetchShipmentById, updateLocation, calculateETA, addShipment };
