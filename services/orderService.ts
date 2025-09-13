import apiService from './apiService';
import type { ClothingItem } from '../types';

export interface OrderItem {
  id: string;
  productId: string;
  productVariantId?: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    imageUrl: string;
    category: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  totalPrice: number;
  items: OrderItem[];
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: {
    productId: string;
    productVariantId?: string;
    quantity: number;
    price: number;
  }[];
  shippingAddressId?: string;
  billingAddressId?: string;
  paymentMethod: string;
  notes?: string;
}

class OrderService {
  // Create a new order
  async createOrder(orderData: CreateOrderData): Promise<{ success: boolean; data?: { order: Order }; error?: string }> {
    try {
      const response = await apiService.request<{ order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      };
    }
  }

  // Get user's orders
  async getUserOrders(): Promise<{ success: boolean; data?: { orders: Order[] }; error?: string }> {
    try {
      const response = await apiService.request<{ orders: Order[] }>('/orders/myorders');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      };
    }
  }

  // Get single order by ID
  async getOrder(orderId: string): Promise<{ success: boolean; data?: { order: Order }; error?: string }> {
    try {
      const response = await apiService.request<{ order: Order }>(`/orders/${orderId}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch order',
      };
    }
  }

  // Update order status (Admin only)
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<{ success: boolean; data?: { order: Order }; error?: string }> {
    try {
      const response = await apiService.request<{ order: Order }>(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update order status',
      };
    }
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<{ success: boolean; data?: { order: Order }; error?: string }> {
    try {
      const response = await apiService.request<{ order: Order }>(`/orders/${orderId}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel order',
      };
    }
  }

  // Get order status history
  async getOrderStatusHistory(orderId: string): Promise<{ success: boolean; data?: { statusHistory: any[] }; error?: string }> {
    try {
      const response = await apiService.request<{ statusHistory: any[] }>(`/orders/${orderId}/status-history`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch order status history',
      };
    }
  }

  // Format order status for display
  formatOrderStatus(status: Order['status']): { label: string; color: string; icon: string } {
    const statusMap = {
      PENDING: { label: 'Pending', color: 'text-yellow-400', icon: '⏳' },
      CONFIRMED: { label: 'Confirmed', color: 'text-blue-400', icon: '✅' },
      PROCESSING: { label: 'Processing', color: 'text-purple-400', icon: '⚙️' },
      SHIPPED: { label: 'Shipped', color: 'text-cyan-400', icon: '🚚' },
      DELIVERED: { label: 'Delivered', color: 'text-green-400', icon: '📦' },
      CANCELLED: { label: 'Cancelled', color: 'text-red-400', icon: '❌' },
      REFUNDED: { label: 'Refunded', color: 'text-gray-400', icon: '💰' },
    };
    return statusMap[status];
  }

  // Format payment status for display
  formatPaymentStatus(status: Order['paymentStatus']): { label: string; color: string; icon: string } {
    const statusMap = {
      PENDING: { label: 'Pending', color: 'text-yellow-400', icon: '⏳' },
      PAID: { label: 'Paid', color: 'text-green-400', icon: '✅' },
      FAILED: { label: 'Failed', color: 'text-red-400', icon: '❌' },
      REFUNDED: { label: 'Refunded', color: 'text-gray-400', icon: '💰' },
    };
    return statusMap[status];
  }

  // Calculate order progress percentage
  calculateOrderProgress(status: Order['status']): number {
    const progressMap = {
      PENDING: 10,
      CONFIRMED: 25,
      PROCESSING: 50,
      SHIPPED: 75,
      DELIVERED: 100,
      CANCELLED: 0,
      REFUNDED: 0,
    };
    return progressMap[status];
  }
}

export const orderService = new OrderService();
export default orderService;
