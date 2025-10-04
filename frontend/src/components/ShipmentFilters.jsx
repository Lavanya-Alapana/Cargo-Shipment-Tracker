import { useEffect, useState } from 'react';
import { Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function ShipmentFilters({ filters, onFilterChange, className = '' }) {
  const [localFilters, setLocalFilters] = useState({
    filterStatus: filters.filterStatus,
    sortKey: filters.sortKey,
    sortOrder: filters.sortOrder
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const SortIcon = ({ sortKey }) => {
    if (filters.sortKey !== sortKey) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return filters.sortOrder === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className={`px-6 py-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-1 text-gray-500" />
              Status
            </div>
          </label>
          <select
            id="status"
            value={localFilters.filterStatus}
            onChange={(e) => handleFilterChange('filterStatus', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="All">All Shipments</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <div className="relative">
            <select
              id="sort"
              value={localFilters.sortKey}
              onChange={(e) => handleFilterChange('sortKey', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
            >
              <option value="shipmentId">Shipment ID</option>
              <option value="status">Status</option>
              <option value="origin">Origin</option>
              <option value="destination">Destination</option>
              <option value="lastUpdated">Last Updated</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SortIcon sortKey={localFilters.sortKey} />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <select
            id="order"
            value={localFilters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
