import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Package, Clock, AlertCircle, CheckCircle, Truck, MoreVertical, Eye, Edit2 } from "lucide-react";
import ShipmentMap from "./ShipmentMap";
import { useAuth } from "../context/AuthContext";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'in-transit': {
      icon: <Truck className="w-3.5 h-3.5 mr-1.5" />,
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-100',
      label: 'In Transit'
    },
    'delivered': {
      icon: <CheckCircle className="w-3.5 h-3.5 mr-1.5" />,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      label: 'Delivered'
    },
    'pending': {
      icon: <Clock className="w-3.5 h-3.5 mr-1.5" />,
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      label: 'Pending'
    },
    'default': {
      icon: <AlertCircle className="w-3.5 h-3.5 mr-1.5" />,
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-100',
      label: status || 'Unknown'
    }
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.default;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border} shadow-sm`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

export default function ShipmentTable({ shipments = [], selectable = false, onSelectionChange }) {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckboxChange = (shipmentId) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(shipmentId)) {
      newSelected.delete(shipmentId);
    } else {
      newSelected.add(shipmentId);
    }
    setSelectedIds(newSelected);

    // Notify parent of selected shipment objects
    if (onSelectionChange) {
      const selectedObjects = shipments.filter(s => newSelected.has(s._id));
      onSelectionChange(selectedObjects);
    }
  };

  const handleViewMap = (shipment) => {
    navigate(`/track/${shipment.shipmentId}`);
  };

  const closeModal = () => {
    setIsMapModalOpen(false);
  };

  if (!shipments || shipments.length === 0) {
    return (
      <div className="text-center py-16 bg-white">
        <div className="mx-auto h-12 w-12 text-gray-300 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Package className="h-6 w-6" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new shipment.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50/50">
          <tr>
            {selectable && (
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-4">
                <span className="sr-only">Select</span>
              </th>
            )}
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipment ID</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Container</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {shipments.map((shipment) => (
            <tr key={shipment.shipmentId} className="hover:bg-gray-50/80 transition-colors duration-150 group">
              {selectable && (
                <td className="px-6 py-4 whitespace-nowrap w-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(shipment._id)}
                    onChange={() => handleCheckboxChange(shipment._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{shipment.shipmentId}</div>
                    <div className="text-xs text-gray-500">Updated recently</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-mono px-2 py-1 rounded border ${shipment.containerId ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                  {shipment.containerId || 'Unassigned'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={shipment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="flex items-center text-sm text-gray-900">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {shipment.origin}
                  </div>
                  <div className="w-0.5 h-3 bg-gray-200 ml-1 my-0.5"></div>
                  <div className="flex items-center text-sm text-gray-900">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {shipment.destination}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2  group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleViewMap(shipment)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Track Shipment"
                  >
                    Track
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Map Modal */}
      {isMapModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Tracking Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Shipment ID: <span className="font-mono font-medium text-gray-700">{selectedShipment.shipmentId}</span>
                  </p>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Info Column */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Status</h4>
                      <StatusBadge status={selectedShipment.status} />
                      <div className="mt-6 space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Origin</p>
                          <p className="text-base font-medium text-gray-900 mt-1">{selectedShipment.origin}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Destination</p>
                          <p className="text-base font-medium text-gray-900 mt-1">{selectedShipment.destination}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Container ID</p>
                          <p className="text-base font-mono text-gray-900 mt-1">{selectedShipment.containerId || 'Pending Assignment'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Column */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-[500px]">
                      <ShipmentMap shipment={selectedShipment} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
