import { useDispatch,useSelector } from "react-redux";
import { addShipment, getShipments } from "../features/shipments/ShipmentSlice";
import ShipmentTable from "../components/ShipmentTable";
import ShipmentFilters from "../components/ShipmentFilters";
import { useEffect,useState } from "react";
import ShipmentForm from "../components/ShipmentForm";


const Dashboard=()=>{
    const dispatch=useDispatch()
    const {items:shipments,loading,error}=useSelector((state)=>state.shipments)

    const [filters,setFilters]=useState({
      filterStatus:"All",
      sortKey:"shipmentId",
      sortOrder:"asc"
    })


  useEffect(() => {
  dispatch(getShipments())
}, [dispatch]);


const addform=async(shipmentData)=>{
  try{
    await dispatch(addShipment(shipmentData)).unwrap()
    console.log("shipment added")

  }
  catch(err)
  {
    console.error("Failed to add shipment:", err);

  }



}

const filteredShipments=(shipments || [])
.filter((s)=>filters.filterStatus==="All" || s.status===filters.filterStatus)
.sort((a,b)=>{
  const key=filters.sortKey
if (!a[key] || !b[key]) return 0;
if (filters.sortOrder === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }

})
    return(
        <div>

           <h1>Shipment Dashboard</h1>
           <ShipmentForm onAdd={addform}/>

           <ShipmentFilters onFilterChange={setFilters} />

            {loading && <p>Loading shipments...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

       <ShipmentTable shipments={filteredShipments} />
        </div>
    )
}

export default Dashboard