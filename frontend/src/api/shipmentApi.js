import axios from 'axios'

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchShipments = async () => {
    const response = await axios.get('http://localhost:3000/api/shipments', {
        headers: getAuthHeader()
    })
    return response.data
}

export const createShipment = async (shipment) => {
    const response = await axios.post('http://localhost:3000/api/shipment', shipment, {
        headers: getAuthHeader()
    })
    return response.data
}


export const fetchETA = async (id) => {
    const response = await axios.get(`http://localhost:3000/api/shipment/${id}/eta`, {
        headers: getAuthHeader()
    })
    return response.data.eta
}