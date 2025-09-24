import { useState } from "react";
import axios from "axios";

export default function ShipmentForm({ onAdd }) {
  const [formData, setFormData] = useState({
    containerId: "",
    shipmentId: "",
    origin: "",
    destination: "",
    status: "Pending",
    originCoordinates: null,
    destinationCoordinates: null
  });

  // Helper function to get coordinates
  const getCoordinates = async (address) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/geocode?address=${encodeURIComponent(address)}`
      );
      return { lat: parseFloat(res.data.lat), lng: parseFloat(res.data.lon) };
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch coordinates for origin and destination
    const originCoordinates = await getCoordinates(formData.origin);
    const destinationCoordinates = await getCoordinates(formData.destination);

    if (!originCoordinates || !destinationCoordinates) {
  return alert("Failed to fetch coordinates. Check addresses.");
}

    // Include coordinates in the shipment data
    const shipmentWithCoords = {
      ...formData,
      originCoordinates,
      destinationCoordinates
    };

    try {
      await onAdd(shipmentWithCoords);

      setFormData({
        containerId: "",
        shipmentId: "",
        origin: "",
        destination: "",
        status: "Pending",
        originCoordinates: null,
        destinationCoordinates: null
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add shipment");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Container ID" name="containerId" value={formData.containerId} onChange={handleChange} />
      <input type="text" placeholder="Shipment ID" name="shipmentId" value={formData.shipmentId} onChange={handleChange} />
      <input type="text" placeholder="Origin" name="origin" value={formData.origin} onChange={handleChange} />
      <input type="text" placeholder="Destination" name="destination" value={formData.destination} onChange={handleChange} />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="Pending">Pending</option>
        <option value="In Transit">In Transit</option>
        <option value="Delivered">Delivered</option>
      </select>
      <button type="submit">Add Shipment</button>
    </form>
  );
}
