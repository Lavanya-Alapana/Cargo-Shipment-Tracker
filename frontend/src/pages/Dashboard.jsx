import { useEffect, useState } from "react";
import ShipmentTable from "../components/ShipmentTable";
import ShipmentForm from "../components/ShipmentForm";
import CreateTripModal from "../components/CreateTripModal";
import UpdateTripModal from "../components/UpdateTripModal";
import { Truck, CheckCircle, Clock, Package, Plus, Navigation } from 'lucide-react';
import { useShipments } from "../hooks/useShipments";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between transition-all duration-200 hover:shadow-md">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <p className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const { shipments, getShipments, addShipment } = useShipments();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Admin State
  const [unassignedShipments, setUnassignedShipments] = useState([]);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  // Driver State
  const [myTrips, setMyTrips] = useState([]);
  const [isUpdateTripModalOpen, setIsUpdateTripModalOpen] = useState(false);
  const [tripToUpdate, setTripToUpdate] = useState(null);

  const handleAddShipment = async (data) => {
    if (data) {
      await addShipment(data);
      setShowCreateForm(false);
    } else {
      setShowCreateForm(false);
    }
  };

  const fetchUnassignedShipments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/shipments?unassigned=true', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnassignedShipments(res.data.shipments);
    } catch (err) {
      console.error("Failed to fetch unassigned shipments", err);
    }
  };

  const fetchMyTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/containers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyTrips(res.data.containers);
    } catch (err) {
      console.error("Failed to fetch trips", err);
    }
  };

  useEffect(() => {
    getShipments();
    if (user?.role === 'ADMIN') {
      fetchUnassignedShipments();
    }
    if (user?.role === 'DRIVER') {
      fetchMyTrips();
    }
  }, [getShipments, user]);

  const handleTripCreated = () => {
    getShipments();
    fetchUnassignedShipments();
    setSelectedShipments([]);
  };

  const handleTripUpdated = () => {
    fetchMyTrips();
  };

  // Calculate stats
  const totalShipments = shipments?.length || 0;
  const inTransit = shipments?.filter(s => s.status === 'In Transit').length || 0;
  const delivered = shipments?.filter(s => s.status === 'Delivered').length || 0;
  const delayed = shipments?.filter(s => s.status === 'Delayed').length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your shipments today.
          </p>
        </div>
        {user?.role !== 'DRIVER' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {showCreateForm ? 'Close Form' : 'Send Parcel'}
          </button>
        )}
      </div>

      {/* Create Shipment Section */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-down mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900">Create New Shipment</h2>
          </div>
          <div className="p-6">
            <ShipmentForm onAdd={handleAddShipment} />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {user?.role !== 'DRIVER' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Shipments"
            value={totalShipments}
            icon={Package}
            color="bg-blue-500"
          />
          <StatCard
            title="In Transit"
            value={inTransit}
            icon={Truck}
            color="bg-indigo-500"
          />
          <StatCard
            title="Delivered"
            value={delivered}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Delayed"
            value={delayed}
            icon={Clock}
            color="bg-red-500"
          />
        </div>
      )}

      {/* Admin: Unassigned Shipments Section */}
      {user?.role === 'ADMIN' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-orange-50/50">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Unassigned Shipments</h2>
              <p className="text-sm text-gray-500">Select shipments to create a new trip</p>
            </div>
            <button
              onClick={() => setIsTripModalOpen(true)}
              disabled={selectedShipments.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Truck className="h-4 w-4 mr-2" />
              Create Trip ({selectedShipments.length})
            </button>
          </div>
          <ShipmentTable
            shipments={unassignedShipments}
            selectable={true}
            onSelectionChange={setSelectedShipments}
          />
        </div>
      )}

      {/* Driver: My Trips Section */}
      {user?.role === 'DRIVER' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50/50">
            <h2 className="text-lg font-semibold text-gray-900">My Assigned Trips</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myTrips.map((trip) => (
                  <tr key={trip._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trip.containerId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.origin} &rarr; {trip.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${trip.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        trip.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.currentLocation || 'Not Started'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setTripToUpdate(trip);
                          setIsUpdateTripModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end ml-auto"
                      >
                        <Navigation className="w-4 h-4 mr-1" /> Update
                      </button>
                    </td>
                  </tr>
                ))}
                {myTrips.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No trips assigned yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* My Shipments Section - Show only for User */}
      {user?.role === 'USER' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">My Shipments</h2>
            <a href="/shipments" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All &rarr;
            </a>
          </div>
          <ShipmentTable shipments={shipments} />
        </div>
      )}

      <CreateTripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        selectedShipments={selectedShipments}
        onSuccess={handleTripCreated}
      />

      <UpdateTripModal
        isOpen={isUpdateTripModalOpen}
        onClose={() => setIsUpdateTripModalOpen(false)}
        trip={tripToUpdate}
        onSuccess={handleTripUpdated}
      />
    </div>
  );
};

export default Dashboard;