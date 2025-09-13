import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChartBarIcon, ShoppingBagIcon, UsersIcon, CurrencyDollarIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: any[];
}

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API calls for admin stats
      // In a real app, these would be actual API endpoints
      const mockStats: AdminStats = {
        totalOrders: 1247,
        totalRevenue: 89432.50,
        totalUsers: 3421,
        totalProducts: 156,
        recentOrders: [
          { id: '1', orderNumber: 'ORD-001', customer: 'John Doe', amount: 129.99, status: 'SHIPPED', date: '2024-01-15' },
          { id: '2', orderNumber: 'ORD-002', customer: 'Jane Smith', amount: 89.50, status: 'PROCESSING', date: '2024-01-15' },
          { id: '3', orderNumber: 'ORD-003', customer: 'Mike Johnson', amount: 234.75, status: 'DELIVERED', date: '2024-01-14' },
          { id: '4', orderNumber: 'ORD-004', customer: 'Sarah Wilson', amount: 67.25, status: 'PENDING', date: '2024-01-14' },
        ]
      };
      
      setStats(mockStats);
    } catch (err) {
      setError('Failed to load admin statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'text-yellow-400 bg-yellow-400/20',
      PROCESSING: 'text-purple-400 bg-purple-400/20',
      SHIPPED: 'text-cyan-400 bg-cyan-400/20',
      DELIVERED: 'text-green-400 bg-green-400/20',
      CANCELLED: 'text-red-400 bg-red-400/20',
    };
    return colors[status as keyof typeof colors] || 'text-gray-400 bg-gray-400/20';
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-12">
          <h3 className="text-xl font-semibold text-white mb-4">Access Denied</h3>
          <p className="text-gray-400 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={onBack}
            className="font-orbitron text-lg inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner className="w-8 h-8" />
        <span className="ml-3 text-gray-300">Loading admin dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={loadAdminStats}
          className="text-cyan-400 hover:text-cyan-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>

      <h2 className="text-3xl font-orbitron font-bold mb-8 text-shadow-glow">
        Admin Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats?.totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingBagIcon className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats?.totalRevenue || 0)}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats?.totalUsers.toLocaleString()}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats?.totalProducts}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 py-3 px-4">Order #</th>
                <th className="text-left text-gray-400 py-3 px-4">Customer</th>
                <th className="text-left text-gray-400 py-3 px-4">Amount</th>
                <th className="text-left text-gray-400 py-3 px-4">Status</th>
                <th className="text-left text-gray-400 py-3 px-4">Date</th>
                <th className="text-left text-gray-400 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-4 text-white font-medium">{order.orderNumber}</td>
                  <td className="py-3 px-4 text-gray-300">{order.customer}</td>
                  <td className="py-3 px-4 text-cyan-400 font-semibold">{formatCurrency(order.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{formatDate(order.date)}</td>
                  <td className="py-3 px-4">
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors text-left">
          <h4 className="text-lg font-semibold text-white mb-2">Manage Products</h4>
          <p className="text-gray-400 text-sm">Add, edit, or remove products from your catalog</p>
        </button>

        <button className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors text-left">
          <h4 className="text-lg font-semibold text-white mb-2">Manage Orders</h4>
          <p className="text-gray-400 text-sm">View and update order statuses</p>
        </button>

        <button className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors text-left">
          <h4 className="text-lg font-semibold text-white mb-2">Manage Users</h4>
          <p className="text-gray-400 text-sm">View and manage user accounts</p>
        </button>
      </div>
    </div>
  );
};
