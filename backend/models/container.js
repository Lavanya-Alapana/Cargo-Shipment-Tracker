const mongoose = require('mongoose');

const containerSchema = mongoose.Schema(
    {
        containerId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        origin: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'In Transit', 'Completed'],
            default: 'Pending',
        },
        currentLocation: {
            type: String,
        },
        assignedShipments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'shipments',
            },
        ],
        routes: [
            {
                location: { type: String },
                coordinates: {
                    lat: { type: Number },
                    lng: { type: Number }
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Container', containerSchema);
