// UpdateLocationForm.jsx
import { useState } from "react";
import axios from "axios";

export default function UpdateLocationForm({ shipmentId, onUpdate }) {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch coordinates from geocode API
  const getCoordinates = async (address) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/geocode?address=${encodeURIComponent(address)}`);
      return { lat: parseFloat(res.data.lat), lng: parseFloat(res.data.lon) };
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert("Please enter a location");

    setLoading(true);
    const coordinates = await getCoordinates(location);

    if (!coordinates) {
      alert("Failed to get coordinates for this location");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/shipment/${shipmentId}/update-location`,
        { location, coordinates }
      );
      alert("Location updated!");
      onUpdate(res.data.shipment);
      setLocation("");
    } catch (err) {
      console.error(err);
      alert("Failed to update location");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Enter New Location
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            id="location"
            placeholder="e.g., 123 Main St, City, Country"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Enter a full address for accurate tracking
        </p>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={() => document.querySelector('button[type="button"][aria-label="Close"]')?.click()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : (
            'Update Location'
          )}
        </button>
      </div>
    </form>
  );
}
