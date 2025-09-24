import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { getETA } from "../features/shipments/ShipmentSlice";
import {useDispatch,useSelector} from 'react-redux'
import { useEffect } from "react";
// Icon for route points
const routeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

// Icon for current location (last point)
const currentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40], // slightly bigger
});

export default function ShipmentMap({ shipment }) {
  if (!shipment || !shipment.routes || shipment.routes.length === 0) {
    return <p>No route available</p>;
  }

  const dispatch = useDispatch();
  const { eta, loading, error } = useSelector((state) => state.shipments);

  useEffect(() => {
    if (shipment?._id) {
      dispatch(getETA(shipment._id));
    }
  }, [shipment, dispatch]);

  // All route coordinates
  const positions = shipment.routes.map((r) => [r.coordinates.lat, r.coordinates.lng]);

  // Current location is the last point in the route
  const currentLocation = positions[positions.length - 1];

  return (
    <MapContainer center={currentLocation} zoom={6} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
      />

      {/* Markers for all route points */}
      {shipment.routes.map((r, idx) => (
        <Marker key={idx} position={[r.coordinates.lat, r.coordinates.lng]} icon={routeIcon}>
          <Popup>
            <b>Location:</b> {r.location} <br />
            <b>Timestamp:</b> {new Date(r.timestamp).toLocaleString()}
          </Popup>
        </Marker>
      ))}

      {/* Marker for current location (last route point) */}
      <Marker position={currentLocation} icon={currentIcon}>
        <Popup>
          <b>Shipment:</b> {shipment.shipmentId} <br />
          <b>Container:</b> {shipment.containerId} <br />
          <b>Current Location:</b> {shipment.routes[shipment.routes.length - 1].location} <br />
          <b>Updated:</b>{" "}
          {new Date(shipment.routes[shipment.routes.length - 1].timestamp).toLocaleString()}
          <br />
          <b>ETA:</b> {loading ? "Loading..." : error ? error : eta ? new Date(eta).toLocaleString() : "N/A"}

        </Popup>

      </Marker>

      <Polyline positions={positions} color="blue" />
    </MapContainer>
  );
}
