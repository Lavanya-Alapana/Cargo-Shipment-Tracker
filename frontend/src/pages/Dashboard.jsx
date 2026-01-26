import { useEffect } from "react";
import ShipmentTable from "../components/ShipmentTable";
import { Truck, CheckCircle, Clock, Package } from 'lucide-react';
import { useShipments } from "../hooks/useShipments";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between transition-all duration-200 hover:shadow-md">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <p className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const { shipments, getShipments } = useShipments();

  useEffect(() => {
    getShipments();
  }, [getShipments]);

  // Calculate stats
  const totalShipments = shipments?.length || 0;
  const inTransit = shipments?.filter(s => s.status === 'In Transit').length || 0;
  const delivered = shipments?.filter(s => s.status === 'Delivered').length || 0;
  const pending = shipments?.filter(s => s.status === 'Pending').length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your shipments today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Shipments"
          value={totalShipments}
          icon={Package}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          title="In Transit"
          value={inTransit}
          icon={Truck}
          color="bg-indigo-500"
          trend={5}
        />
        <StatCard
          title="Delivered"
          value={delivered}
          icon={CheckCircle}
          color="bg-green-500"
          trend={8}
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={Clock}
          color="bg-amber-500"
          trend={-2}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <a href="/shipments" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All Shipments &rarr;
          </a>
        </div>
        <ShipmentTable shipments={shipments.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Dashboard;