const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Products
  async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
    featured?: boolean;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return this.request<{
      products: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(endpoint);
  }

  async getProduct(slug: string) {
    return this.request<{ product: any }>(`/products/${slug}`);
  }

  async getRelatedProducts(slug: string, limit = 4) {
    return this.request<{ products: any[] }>(`/products/${slug}/related?limit=${limit}`);
  }

  // Categories
  async getCategories() {
    return this.request<{ categories: any[] }>('/categories');
  }

  async getCategory(slug: string) {
    return this.request<{ category: any }>(`/categories/${slug}`);
  }

  // User Profile
  async getUserProfile() {
    return this.request<{ user: any }>('/users/profile');
  }

  async updateUserProfile(profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    return this.request<{ user: any }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Addresses
  async getUserAddresses() {
    return this.request<{ addresses: any[] }>('/users/addresses');
  }

  async addAddress(addressData: {
    type: 'billing' | 'shipping';
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  }) {
    return this.request<{ address: any }>('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  // Orders
  async getUserOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    return this.request<{
      orders: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(endpoint);
  }

  async getOrder(orderId: string) {
    return this.request<{ order: any }>(`/orders/${orderId}`);
  }

  async createOrder(orderData: {
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
    }>;
    shippingAddressId?: string;
    billingAddressId?: string;
    notes?: string;
  }) {
    return this.request<{ order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
