
import ShipmentMap from "./ShipmentMap";
import { useState ,} from "react";
import UpdateLocationForm from "./UpdateLocation";
export default function ShipmentTable({ shipments=[] }) {

    const [selectedShipment, setSelectedShipment] = useState(null);

   const handleViewMap=(shipment)=>{
    setSelectedShipment(shipment)
   }
  return (
    <>
    <table>
      <thead>
        <tr>
          <th>Shipment ID</th>
          <th>Container ID</th>
          <th>Status</th>
          <th>Origin</th>
          <th>Destination</th>
          <th>ETA</th>
        </tr>
      </thead>
      <tbody>
        {shipments.length > 0 ? (
  shipments.map((shipment) => 
    shipment ? (
      <tr key={shipment.shipmentId}>
        <td>{shipment.shipmentId}</td>
        <td>{shipment.containerId}</td>
        <td>{shipment.status}</td>
        <td>{shipment.origin}</td>
        <td>{shipment.destination}</td>
        <td>
          <button onClick={() => handleViewMap(shipment)}>View Map</button>
        </td>
      </tr>
    ) : null
  )
) : (
  <tr>
    <td colSpan="6">No shipments found</td>
  </tr>
)}

      </tbody>
    </table>


     {selectedShipment && (
        <>
          <UpdateLocationForm
            shipmentId={selectedShipment.shipmentId}
            onUpdate={(updatedShipment) => setSelectedShipment(updatedShipment)}
          />

          <h3>Map for {selectedShipment.shipmentId}</h3>
          <ShipmentMap shipment={selectedShipment} />
        </>
      )}
    
    
    
    </>
  );
}
