import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, TruckIcon, MapPinIcon, CreditCardIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import orderService, { type Order } from '../services/orderService';

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);

  useEffect(() => {
    loadStatusHistory();
  }, [order.id]);

  const loadStatusHistory = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrderStatusHistory(order.id);
      if (response.success && response.data) {
        setStatusHistory(response.data.statusHistory);
      }
    } catch (error) {
      console.error('Failed to load status history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const orderStatus = orderService.formatOrderStatus(order.status);
  const paymentStatus = orderService.formatPaymentStatus(order.paymentStatus);
  const progress = orderService.calculateOrderProgress(order.status);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Orders
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Order Header */}
        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
                Order #{order.orderNumber}
              </h2>
              <p className="text-gray-400">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderStatus.color} bg-gray-700`}>
                {orderStatus.icon} {orderStatus.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatus.color} bg-gray-700`}>
                {paymentStatus.icon} {paymentStatus.label}
              </span>
            </div>
          </div>

          {/* Order Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Order Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-2xl font-bold text-cyan-400">
            {formatPrice(order.totalPrice)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Items */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-600 rounded-md flex items-center justify-center">
                    {item.product?.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      {item.product?.name || `Product ${item.productId}`}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {item.product?.category || 'Unknown Category'}
                    </p>
                    <p className="text-sm text-gray-300">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-cyan-400">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Billing Address */}
          <div className="space-y-6">
            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TruckIcon className="w-5 h-5" />
                  Shipping Address
                </h3>
                <div className="text-gray-300 space-y-1">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                </div>
              </div>
            )}

            {/* Billing Address */}
            {order.billingAddress && (
              <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5" />
                  Billing Address
                </h3>
                <div className="text-gray-300 space-y-1">
                  <p>{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                  <p>{order.billingAddress.address1}</p>
                  {order.billingAddress.address2 && <p>{order.billingAddress.address2}</p>}
                  <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                  <p>{order.billingAddress.country}</p>
                  {order.billingAddress.phone && <p>Phone: {order.billingAddress.phone}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Notes</h3>
            <p className="text-gray-300">{order.notes}</p>
          </div>
        )}

        {/* Status History */}
        {statusHistory.length > 0 && (
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status History</h3>
            <div className="space-y-3">
              {statusHistory.map((status, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{status.status}</p>
                    <p className="text-gray-400 text-sm">{formatDate(status.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
