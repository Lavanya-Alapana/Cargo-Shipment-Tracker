import { useState, useEffect } from 'react';
import { X, Truck, MapPin, User } from 'lucide-react';
import axios from 'axios';

const CreateTripModal = ({ isOpen, onClose, selectedShipments, onSuccess }) => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        containerId: '',
        driverId: '',
        origin: '',
        destination: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchDrivers();
            // Auto-fill origin/dest from first selected shipment if available
            if (selectedShipments.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    origin: selectedShipments[0].origin,
                    destination: selectedShipments[0].destination
                }));
            }
            // Generate random Container ID
            setFormData(prev => ({
                ...prev,
                containerId: 'TRIP-' + Math.random().toString(36).substr(2, 9).toUpperCase()
            }));
        }
    }, [isOpen, selectedShipments]);

    const fetchDrivers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/auth/drivers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDrivers(res.data);
        } catch (err) {
            console.error("Failed to fetch drivers", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/container', {
                ...formData,
                shipmentIds: selectedShipments.map(s => s._id)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to create trip", err);
            alert("Failed to create trip");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
                <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-semibold text-gray-900">Create New Trip</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trip ID</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.containerId}
                                    onChange={e => setFormData({ ...formData, containerId: e.target.value })}
                                    className="pl-9 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Driver</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <select
                                    value={formData.driverId}
                                    onChange={e => setFormData({ ...formData, driverId: e.target.value })}
                                    className="pl-9 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Select a driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver._id} value={driver._id}>{driver.name} ({driver.email})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                                <input
                                    type="text"
                                    value={formData.origin}
                                    onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                                <input
                                    type="text"
                                    value={formData.destination}
                                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-blue-700">
                                {selectedShipments.length} shipments selected for this trip.
                            </p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-75"
                            >
                                {loading ? 'Creating...' : 'Create Trip'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTripModal;
