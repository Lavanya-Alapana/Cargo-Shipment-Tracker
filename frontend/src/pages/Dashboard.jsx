import { useDispatch, useSelector } from "react-redux";
import { addShipment, getShipments } from "../features/shipments/ShipmentSlice";
import ShipmentTable from "../components/ShipmentTable";
import ShipmentFilters from "../components/ShipmentFilters";
import { useEffect, useState } from "react";
import ShipmentForm from "../components/ShipmentForm";
import { Plus, X } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: shipments, loading, error } = useSelector((state) => state.shipments);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [filters, setFilters] = useState({
    filterStatus: "All",
    sortKey: "shipmentId",
    sortOrder: "asc"
  });

  useEffect(() => {
    dispatch(getShipments());
  }, [dispatch]);

  const handleAddShipment = async (shipmentData) => {
    if (!shipmentData) {
      setShowAddForm(false);
      return;
    }
    
    try {
      await dispatch(addShipment(shipmentData)).unwrap();
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipment Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage your shipments efficiently
            </p>
          </div>
          
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Shipment
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Add New Shipment</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <ShipmentForm onAdd={handleAddShipment} />
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <ShipmentFilters
            filters={filters}
            onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
          />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ShipmentTable shipments={filteredShipments} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;