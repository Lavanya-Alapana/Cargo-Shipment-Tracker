import { useState, useEffect } from "react";

export default function ShipmentFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    filterStatus: "All",
    sortKey: "shipmentId",
    sortOrder: "asc"
  });


  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  

  return (
    <div>
      <select value={filters.filterStatus} onChange={(e) => setFilters(prev => ({ ...prev, filterStatus: e.target.value }))}>
        <option value="All">All</option>
        <option value="In Transit">In Transit</option>
        <option value="Delivered">Delivered</option>
        <option value="Pending">Pending</option>
      </select>

      <select value={filters.sortKey} onChange={(e) => setFilters(prev => ({ ...prev, sortKey: e.target.value }))}>
        <option value="shipmentId">Shipment ID</option>
        <option value="status">Status</option>
        <option value="origin">Origin</option>
        <option value="destination">Destination</option>
      </select>

      <select value={filters.sortOrder} onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
