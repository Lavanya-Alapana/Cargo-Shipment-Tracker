import { useState } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import axios from 'axios';

const UpdateTripModal = ({ isOpen, onClose, trip, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        status: trip?.status || 'In Transit',
        location: '',
        lat: '',
        lng: ''
    });

    const fetchCoordinates = async () => {
        if (!formData.location) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/geocode?address=${encodeURIComponent(formData.location)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                const { lat, lon } = response.data;
                setFormData(prev => ({
                    ...prev,
                    lat: lat,
                    lng: lon
                }));
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            alert("Failed to fetch coordinates. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Construct payload
            const payload = {
                status: formData.status,
                location: formData.location,
            };

            // Add coordinates if provided
            if (formData.lat && formData.lng) {
                payload.coordinates = {
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng)
                };
            }

            await axios.post(`http://localhost:3000/api/container/${trip.containerId}/update`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to update trip", err);
            alert("Failed to update trip");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !trip) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
                <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-semibold text-gray-900">Update Trip Status</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-blue-50 p-3 rounded-md mb-4">
                            <p className="text-sm text-blue-800 font-medium">Trip: {trip.containerId}</p>
                            <p className="text-xs text-blue-600">{trip.origin} &rarr; {trip.destination}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="In Transit">In Transit</option>
                                <option value="Delayed">Delayed</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location (City/Place)</label>
                            <div className="flex space-x-2">
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="pl-9 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                        placeholder="e.g. Hyderabad Checkpost"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchCoordinates}
                                    disabled={!formData.location || loading}
                                    className="px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Get Coords
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.lat}
                                    onChange={e => setFormData({ ...formData, lat: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50"
                                    placeholder="17.3850"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.lng}
                                    onChange={e => setFormData({ ...formData, lng: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50"
                                    placeholder="78.4867"
                                    readOnly
                                />
                            </div>
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
                                {loading ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateTripModal;
