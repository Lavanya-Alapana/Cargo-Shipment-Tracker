
import { useState } from "react";
import { MapPin, Package, Clock, AlertCircle, CheckCircle, Truck, X } from "lucide-react";
import ShipmentMap from "./ShipmentMap";
import UpdateLocationForm from "./UpdateLocation";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'in-transit': {
      icon: <Truck className="w-4 h-4 mr-1" />,
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      label: 'In Transit'
    },
    'delivered': {
      icon: <CheckCircle className="w-4 h-4 mr-1" />,
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      label: 'Delivered'
    },
    'pending': {
      icon: <Clock className="w-4 h-4 mr-1" />,
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      label: 'Pending'
    },
    'default': {
      icon: <AlertCircle className="w-4 h-4 mr-1" />,
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      label: status || 'Unknown'
    }
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.default;
  
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

export default function ShipmentTable({ shipments = [] }) {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [shipmentToUpdate, setShipmentToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewMap = (shipment) => {
    setSelectedShipment(shipment);
    setIsMapModalOpen(true);
  };

  const handleUpdateLocation = (shipment) => {
    setShipmentToUpdate(shipment);
    setIsUpdateModalOpen(true);
  };

  const closeModal = () => {
    setIsMapModalOpen(false);
    setIsUpdateModalOpen(false);
  };

  const handleLocationUpdated = (updatedShipment) => {
    setSelectedShipment(updatedShipment);
    setIsUpdateModalOpen(false);
  };
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4 sm:mb-0">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Shipment Tracking
            </h2>
            <div className="w-full sm:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.filter(shipment => 
                shipment && (
                  shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (shipment.containerId && shipment.containerId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  shipment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
                )
              ).length > 0 ? (
                shipments
                  .filter(shipment => {
                    if (!shipment) return false;
                    const term = searchTerm.toLowerCase();
                    return (
                      shipment.shipmentId.toLowerCase().includes(term) ||
                      (shipment.containerId && shipment.containerId.toLowerCase().includes(term)) ||
                      shipment.status.toLowerCase().includes(term) ||
                      shipment.origin.toLowerCase().includes(term) ||
                      shipment.destination.toLowerCase().includes(term)
                    );
                  })
                  .map((shipment) =>
                  shipment ? (
                    <tr key={shipment.shipmentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shipment.shipmentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shipment.containerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shipment.origin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shipment.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleViewMap(shipment)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <MapPin className="w-3.5 h-3.5 mr-1.5" /> Track
                          </button>
                          <button
                            onClick={() => handleUpdateLocation(shipment)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Update Location
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : null
                )
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No shipments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Modal */}
      {isMapModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-700/90"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl w-full max-h-[90vh] flex flex-col">
              {/* Header Section */}
              <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Shipment Tracking - {selectedShipment.shipmentId}
                    </h3>
                    <div className="mt-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Container ID:</span> {selectedShipment.containerId}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Status Cards */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">STATUS</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedShipment.status} />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">ORIGIN</p>
                    <p className="text-sm font-medium text-gray-900">{selectedShipment.origin}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">DESTINATION</p>
                    <p className="text-sm font-medium text-gray-900">{selectedShipment.destination}</p>
                  </div>
                </div>
              </div>

              {/* Map Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <h4 className="text-base font-semibold text-gray-800 p-4 border-b border-gray-200">Route Map</h4>
                  <div className="h-[500px] w-full">
                    <ShipmentMap shipment={selectedShipment} />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Location Modal */}
      {isUpdateModalOpen && shipmentToUpdate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-700/90 transition-opacity" 
              onClick={closeModal}
              aria-hidden="true"
            ></div>
            
            {/* Modal Container */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Update Location - {shipmentToUpdate.shipmentId}
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <UpdateLocationForm
                  shipmentId={shipmentToUpdate.shipmentId}
                  onUpdate={handleLocationUpdated}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
