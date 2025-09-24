import axios from 'axios'

export const fetchShipments=async()=>{
    const response=await axios.get('http://localhost:3000/api/shipments')
    return response.data
}

export const createShipment=async(shipment)=>{
    await axios.post('http://localhost:3000/api/shipment',shipment)
}


export const fetchETA=async(id)=>{
   const response= await axios.get(`http://localhost:3000/api/shipment/${id}/eta`)
   return response.data.eta
}