import { useState, useCallback } from 'react';
import { createShipment, fetchETA, fetchShipments } from '../api/shipmentApi';

export const useShipments = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [eta, setEta] = useState(null);

    const getShipments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchShipments();
            // API returns { shipments: [...] } based on previous code
            setShipments(data.shipments);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addShipment = useCallback(async (shipmentData) => {
        setLoading(true);
        setError(null);
        try {
            const newShipment = await createShipment(shipmentData);
            // Optimistically update or re-fetch? 
            // Previous implementation pushed to array.
            // If newShipment is the object, we can push it.
            setShipments(prev => [...prev, newShipment]);
            return newShipment;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getETA = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchETA(id);
            setEta(result);
            return result;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        shipments,
        loading,
        error,
        eta,
        getShipments,
        addShipment,
        getETA
    };
};
