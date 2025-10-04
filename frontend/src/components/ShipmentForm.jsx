import { useState } from "react";
import axios from "axios";
import { Package, Truck, MapPin, Tag, Loader2, X, Calendar, Box, Info } from 'lucide-react';

export default function ShipmentForm({ onAdd }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    containerId: "",
    shipmentId: "",
    origin: "",
    destination: "",
    status: "Pending",
    originCoordinates: null,
    destinationCoordinates: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCoordinates = async (address) => {
    if (!address) return null;
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      if (!res.data || res.data.length === 0) return null;
      return { 
        lat: parseFloat(res.data[0]?.lat), 
        lng: parseFloat(res.data[0]?.lon) 
      };
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Fetch coordinates for origin and destination
      const [originCoordinates, destinationCoordinates] = await Promise.all([
        getCoordinates(formData.origin),
        getCoordinates(formData.destination)
      ]);

      if (!originCoordinates || !destinationCoordinates) {
        alert("Could not find coordinates for one or both locations. Please check the addresses and try again.");
        return;
      }

      const shipmentWithCoords = {
        ...formData,
        originCoordinates,
        destinationCoordinates,
        lastUpdated: new Date().toISOString()
      };

      await onAdd(shipmentWithCoords);
      
      // Reset form on success
      setFormData({
        containerId: "",
        shipmentId: "",
        origin: "",
        destination: "",
        status: "Pending",
        originCoordinates: null,
        destinationCoordinates: null,
      });
    } catch (err) {
      console.error("Error adding shipment:", err);
      alert("Failed to add shipment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onAdd(null); // Signal to parent to close the form
  };

  const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-150 ease-in-out text-sm border p-2";
  const labelClass = "block text-xs font-medium text-gray-600 uppercase tracking-wider";
  const sectionTitleClass = "text-base font-semibold text-gray-700 mb-3 flex items-center";
  const iconClass = "h-4 w-4 text-blue-500 mr-2";
  const cardClass = "bg-white rounded-lg shadow-xs border border-gray-100 p-4 mb-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information Card */}
      <div className={cardClass}>
        <h3 className={sectionTitleClass}>
          <Info className={iconClass} />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="containerId" className={labelClass}>
              Container ID
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Package className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="containerId"
                name="containerId"
                value={formData.containerId}
                onChange={handleChange}
                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
                placeholder="CONT-12345"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="shipmentId" className={labelClass}>
              Shipment ID
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="shipmentId"
                name="shipmentId"
                value={formData.shipmentId}
                onChange={handleChange}
                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
                placeholder="SHIP-67890"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Route Information Card */}
      <div className={cardClass}>
        <h3 className={sectionTitleClass}>
          <MapPin className={iconClass} />
          Route Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin" className={labelClass}>
              Origin
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
                placeholder="New York, NY"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="destination" className={labelClass}>
              Destination
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
                placeholder="Los Angeles, CA"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status & Additional Info */}
      <div className={cardClass}>
        <h3 className={sectionTitleClass}>
          <Truck className={iconClass} />
          Status & Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className={labelClass}>
              Shipment Status
            </label>
            <div className="relative mt-1">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full pl-3 pr-8 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 rounded-md"
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="date" className={labelClass}>
              Expected Delivery Date
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="expectedDeliveryDate"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate || ''}
                onChange={handleChange}
                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-1">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <X className="h-3.5 w-3.5 mr-1.5" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5" />
              Saving...
            </>
          ) : (
            'Save Shipment'
          )}
        </button>
      </div>
    </form>
  );
}
