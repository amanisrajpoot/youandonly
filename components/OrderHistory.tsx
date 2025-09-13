import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, EyeIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import orderService, { type Order } from '../services/orderService';

interface OrderHistoryProps {
  onBack: () => void;
  onViewOrder: (order: Order) => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ onBack, onViewOrder }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await orderService.getUserOrders();
      
      if (response.success && response.data) {
        setOrders(response.data.orders);
      } else {
        setError(response.error || 'Failed to load orders');
      }
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner className="w-8 h-8" />
        <span className="ml-3 text-gray-300">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={loadOrders}
          className="text-cyan-400 hover:text-cyan-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-12">
          <h3 className="text-xl font-semibold text-white mb-4">No Orders Yet</h3>
          <p className="text-gray-400 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <button
            onClick={onBack}
            className="font-orbitron text-lg inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          >
            Start Shopping
          </button>
        </div>
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
        Order History
      </h2>

      <div className="space-y-6">
        {orders.map((order) => {
          const orderStatus = orderService.formatOrderStatus(order.status);
          const paymentStatus = orderService.formatPaymentStatus(order.paymentStatus);
          const progress = orderService.calculateOrderProgress(order.status);

          return (
            <div
              key={order.id}
              className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Order #{order.orderNumber}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderStatus.color} bg-gray-700`}>
                      {orderStatus.icon} {orderStatus.label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatus.color} bg-gray-700`}>
                      {paymentStatus.icon} {paymentStatus.label}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  
                  <p className="text-cyan-400 font-semibold">
                    {formatPrice(order.totalPrice)}
                  </p>

                  {/* Order Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Order Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <span>{item.quantity}x</span>
                      <span>{item.product?.name || `Product ${item.productId}`}</span>
                      {index < Math.min(order.items.length, 3) - 1 && <span>•</span>}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-gray-500 text-sm">
                      +{order.items.length - 3} more items
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
