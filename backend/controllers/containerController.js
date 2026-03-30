const Container = require('../models/container');
const Shipment = require('../models/shipment');
const { asyncHandler } = require('../src/utils/asyncHandler');
const { successResponse } = require('../src/utils/apiResponse');
const logger = require('../src/utils/logger');

const createContainer = asyncHandler(async (req, res) => {
    const { containerId, driverId, origin, destination, shipmentIds } = req.body;

    // 1. Create Container
    const container = await Container.create({
        containerId,
        driverId,
        origin,
        destination,
        assignedShipments: shipmentIds,
    });

    // 2. Update Shipments with containerId
    if (shipmentIds && shipmentIds.length > 0) {
        await Shipment.updateMany(
            { _id: { $in: shipmentIds } },
            {
                $set: {
                    containerId: containerId,
                    status: 'In Transit' // Optionally update status or keep as Pending until Driver starts
                }
            }
        );
    }

    logger.info(`New container created: ${containerId} with ${shipmentIds.length} shipments`);
    return successResponse(res, 201, "Container created successfully", { container });
});

const getContainers = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role === 'DRIVER') {
        query.driverId = req.user._id;
    }

    const containers = await Container.find(query)
        .populate('driverId', 'name email')
        .populate('assignedShipments', 'shipmentId origin destination status');

    logger.info(`Fetched ${containers.length} containers`);
    return successResponse(res, 200, "Containers fetched successfully", { containers });
});

const updateContainerLocation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { location, status, coordinates } = req.body;

    const container = await Container.findOne({ containerId: id });

    if (!container) {
        res.status(404);
        throw new Error('Container not found');
    }

    // Update Container
    container.currentLocation = location;
    if (status) container.status = status;

    container.routes.push({
        location,
        coordinates,
        timestamp: new Date()
    });

    await container.save();

    // Propagate to Shipments
    if (container.assignedShipments && container.assignedShipments.length > 0) {
        await Shipment.updateMany(
            { _id: { $in: container.assignedShipments } },
            {
                $set: { status: status || 'In Transit' },
                $push: {
                    routes: {
                        location,
                        coordinates,
                        timestamp: new Date()
                    }
                }
            }
        );
    }

    logger.info(`Updated container ${id} location to ${location}`);
    return successResponse(res, 200, "Container location updated", { container });
});

module.exports = { createContainer, getContainers, updateContainerLocation };
