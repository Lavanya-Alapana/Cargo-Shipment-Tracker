import { useEffect, useState } from 'react';
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';

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

  return (
    <div className={`px-6 py-4 bg-white ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Filters */}
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={localFilters.filterStatus}
              onChange={(e) => handleFilterChange('filterStatus', e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <div className="relative">
              <select
                value={localFilters.sortKey}
                onChange={(e) => handleFilterChange('sortKey', e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer appearance-none"
              >
                <option value="shipmentId">ID</option>
                <option value="status">Status</option>
                <option value="origin">Origin</option>
                <option value="destination">Destination</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order Toggle */}
        <div className="flex items-center">
          <div className="bg-gray-100 p-1 rounded-lg flex items-center">
            <button
              onClick={() => handleFilterChange('sortOrder', 'asc')}
              className={`p-1.5 rounded-md transition-all ${localFilters.sortOrder === 'asc'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              title="Ascending"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleFilterChange('sortOrder', 'desc')}
              className={`p-1.5 rounded-md transition-all ${localFilters.sortOrder === 'desc'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              title="Descending"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
