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
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Enter new location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Location"}
      </button>
    </form>
  );
}
