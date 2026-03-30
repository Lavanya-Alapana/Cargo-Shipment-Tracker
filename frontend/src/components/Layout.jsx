import { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    BarChart3,
    Settings,
    Search,
    Bell,
    User,
    LogOut,
    Menu,
    X,
    ChevronDown,
    UserPlus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${active
            ? 'bg-primary-800 text-white shadow-md border border-primary-700'
            : 'text-gray-400 hover:bg-primary-800/50 hover:text-white'
            }`}
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
    </button>
);

import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsSidebarOpen(false); // Close sidebar on mobile after navigation
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-primary-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-primary-900/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="h-full flex flex-col border-r border-primary-800">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-primary-800">
                        <div className="flex items-center space-x-2 text-white">
                            <Package className="w-8 h-8 text-blue-400" />
                            <span className="text-xl font-bold tracking-tight">CargoTrack</span>
                        </div>
                        <button
                            className="ml-auto lg:hidden text-gray-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <SidebarItem
                            icon={LayoutDashboard}
                            label="Dashboard"
                            active={isActive('/')}
                            onClick={() => handleNavigation('/')}
                        />
                        {user?.role === 'ADMIN' && (
                            <SidebarItem
                                icon={Package}
                                label="Shipments"
                                active={isActive('/shipments')}
                                onClick={() => handleNavigation('/shipments')}
                            />
                        )}
                        {user?.role === 'ADMIN' && (
                            <SidebarItem
                                icon={BarChart3}
                                label="Analytics"
                                active={isActive('/analytics')}
                                onClick={() => handleNavigation('/analytics')}
                            />
                        )}
                        {user?.role === 'ADMIN' && (
                            <SidebarItem
                                icon={UserPlus}
                                label="Create Driver"
                                active={isActive('/create-driver')}
                                onClick={() => handleNavigation('/create-driver')}
                            />
                        )}
                    </nav>

                    {/* User Profile Summary */}
                    <div className="p-4 border-t border-primary-800">
                        <div className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-primary-800 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-blue-200">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                                <p className="text-[10px] text-blue-400 uppercase font-bold">{user?.role}</p>
                            </div>
                            <button onClick={handleLogout} title="Logout">
                                <LogOut className="w-4 h-4 text-gray-500 hover:text-red-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-primary-200 flex items-center justify-between px-4 lg:px-8 shadow-sm z-10">
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                        onClick={toggleSidebar}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md ml-4 lg:ml-0">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-primary-200 rounded-lg leading-5 bg-primary-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                placeholder="Search shipments, containers, or locations..."
                            />
                        </div>
                    </div>

                    {/* Right Header Actions */}
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        <div className="h-8 w-px bg-primary-200 mx-2"></div>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-800 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
