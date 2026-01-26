import axios from 'axios'

export const fetchShipments = async () => {
    const response = await axios.get('http://localhost:3000/api/shipments')
    return response.data
}

export const createShipment = async (shipment) => {
    const response = await axios.post('http://localhost:3000/api/shipment', shipment)
    return response.data
}


export const fetchETA = async (id) => {
    const response = await axios.get(`http://localhost:3000/api/shipment/${id}/eta`)
    return response.data.eta
}