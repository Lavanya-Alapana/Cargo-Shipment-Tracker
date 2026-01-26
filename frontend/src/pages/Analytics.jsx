import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

const AnalyticsCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {change}
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
        </div>
    </div>
);

const Analytics = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Detailed insights into your shipment performance and logistics.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                    title="Total Revenue"
                    value="$124,500"
                    change="+12.5%"
                    icon={BarChart3}
                    color="bg-blue-500"
                />
                <AnalyticsCard
                    title="Active Customers"
                    value="1,240"
                    change="+8.2%"
                    icon={Users}
                    color="bg-indigo-500"
                />
                <AnalyticsCard
                    title="On-Time Delivery"
                    value="98.5%"
                    change="+2.4%"
                    icon={Calendar}
                    color="bg-green-500"
                />
                <AnalyticsCard
                    title="Avg. Transit Time"
                    value="4.2 Days"
                    change="-1.5%"
                    icon={TrendingUp}
                    color="bg-amber-500"
                />
            </div>

            {/* Placeholder for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96 flex items-center justify-center">
                    <div className="text-center">
                        <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                            <BarChart3 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Shipment Volume</h3>
                        <p className="text-gray-500 mt-1">Chart visualization coming soon</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96 flex items-center justify-center">
                    <div className="text-center">
                        <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                            <TrendingUp className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Revenue Trends</h3>
                        <p className="text-gray-500 mt-1">Chart visualization coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
