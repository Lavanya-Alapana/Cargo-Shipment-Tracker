import { useEffect, useState } from "react";
import ShipmentTable from "../components/ShipmentTable";
import ShipmentFilters from "../components/ShipmentFilters";
import ShipmentForm from "../components/ShipmentForm";
import { Plus, X } from 'lucide-react';
import { useShipments } from "../hooks/useShipments";
import { useAuth } from "../context/AuthContext";

const Shipments = () => {
    const { shipments, loading, error, getShipments, addShipment } = useShipments();
    const { user } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);

    const [filters, setFilters] = useState({
        filterStatus: "All",
        sortKey: "shipmentId",
        sortOrder: "asc"
    });

    useEffect(() => {
        getShipments();
    }, [getShipments]);

    const handleAddShipment = async (shipmentData) => {
        if (!shipmentData) {
            setShowAddForm(false);
            return;
        }

        try {
            await addShipment(shipmentData);
            setShowAddForm(false);
        } catch (err) {
            console.error("Failed to add shipment:", err);
        }
    };

    const filteredShipments = (shipments || [])
        .filter((s) => filters.filterStatus === "All" || s.status === filters.filterStatus)
        .sort((a, b) => {
            const key = filters.sortKey;
            if (!a[key] || !b[key]) return 0;
            return filters.sortOrder === "asc"
                ? a[key] > b[key] ? 1 : -1
                : a[key] < b[key] ? 1 : -1;
        });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Shipments</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track all your cargo shipments in one place.
                    </p>
                </div>

                {user?.role === 'ADMIN' && !showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Shipment
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-down">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Create New Shipment</h2>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="p-6">
                        <ShipmentForm onAdd={handleAddShipment} />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    <ShipmentFilters
                        filters={filters}
                        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
                    />
                </div>
                <ShipmentTable shipments={filteredShipments} />
            </div>
        </div>
    );
};

export default Shipments;
