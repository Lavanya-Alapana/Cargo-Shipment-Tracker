import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShipments } from "../hooks/useShipments";
import ShipmentMap from "../components/ShipmentMap";
import { Package, Truck, MapPin, Calendar, ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TrackShipment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { shipments, getShipments, loading } = useShipments();
    const [shipment, setShipment] = useState(null);

    useEffect(() => {
        if (!shipments.length) {
            getShipments();
        }
    }, [getShipments, shipments.length]);

    useEffect(() => {
        if (shipments.length > 0) {
            const found = shipments.find(s => s.shipmentId === id);
            setShipment(found);
        }
    }, [shipments, id]);

    if (loading && !shipment) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!shipment && !loading && shipments.length > 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-900">Shipment Not Found</h2>
                <p className="text-gray-500 mt-2">The shipment with ID {id} could not be found.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!shipment) return null;

    const steps = [
        { status: 'Pending', label: 'Order Created', icon: Package },
        { status: 'In Transit', label: 'In Transit', icon: Truck },
        { status: 'Delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === shipment.status);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Track Shipment</h1>
                    <p className="text-sm text-gray-500">ID: <span className="font-mono font-medium">{shipment.shipmentId}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipment Progress</h3>
                        <div className="relative">
                            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2 hidden sm:block"></div>
                            <div className="flex flex-col sm:flex-row justify-between relative z-10 space-y-8 sm:space-y-0">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isCompleted = index <= currentStepIndex || (shipment.status === 'Delivered');
                                    const isCurrent = shipment.status === step.status;

                                    let colorClass = isCompleted ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400";
                                    if (shipment.status === 'Delayed' && step.status === 'In Transit') {
                                        colorClass = "bg-red-500 text-white";
                                    }

                                    return (
                                        <div key={step.label} className="flex flex-row sm:flex-col items-center sm:text-center space-x-4 sm:space-x-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass} ring-4 ring-white transition-colors duration-300`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="sm:mt-2">
                                                <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {step.label}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-xs text-blue-600 font-medium mt-0.5">Current Status</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[500px]">
                        <ShipmentMap shipment={shipment} />
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Details</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                                <div className="mt-1 flex items-center">
                                    {shipment.status === 'Delayed' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Delayed
                                        </span>
                                    ) : (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {shipment.status}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-start">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">From</p>
                                        <p className="text-sm font-medium text-gray-900">{shipment.origin}</p>
                                    </div>
                                </div>
                                <div className="ml-2.5 w-0.5 h-6 bg-gray-200 my-1"></div>
                                <div className="flex items-start">
                                    <MapPin className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">To</p>
                                        <p className="text-sm font-medium text-gray-900">{shipment.destination}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Estimated Delivery</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {shipment.eta ? new Date(shipment.eta).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center">
                                    <Package className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Package Info</p>
                                        <p className="text-sm text-gray-900">
                                            {shipment.weight ? `${shipment.weight} kg` : 'Weight N/A'} • {shipment.description || 'No description'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 font-mono">{shipment.containerId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackShipment;
