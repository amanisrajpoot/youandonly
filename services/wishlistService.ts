import apiService from './apiService';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice?: number;
    sku?: string;
    isActive: boolean;
    isFeatured: boolean;
    tags: string[];
    images: Array<{
      id: string;
      url: string;
      alt?: string;
      isPrimary: boolean;
      order: number;
    }>;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    variants: Array<{
      id: string;
      name: string;
      sku?: string;
      price: number;
      stock: number;
      attributes: Record<string, any>;
      isActive: boolean;
    }>;
  };
}

class WishlistService {
  // Get user wishlist
  async getWishlist(): Promise<{ success: boolean; data?: { wishlistItems: WishlistItem[] }; error?: string }> {
    try {
      const response = await apiService.request<{ wishlistItems: WishlistItem[] }>('/users/wishlist');
      return response;
    } catch (error) {
      console.error('Failed to get wishlist:', error);
      return { success: false, error: 'Failed to get wishlist' };
    }
  }

  // Add item to wishlist
  async addToWishlist(productId: string): Promise<{ success: boolean; data?: { wishlistItem: WishlistItem }; error?: string }> {
    try {
      const response = await apiService.request<{ wishlistItem: WishlistItem }>('/users/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      return response;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return { success: false, error: 'Failed to add to wishlist' };
    }
  }

  // Remove item from wishlist
  async removeFromWishlist(productId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.request(`/users/wishlist/${productId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      return { success: false, error: 'Failed to remove from wishlist' };
    }
  }

  // Check if product is in wishlist
  async isInWishlist(productId: string): Promise<{ success: boolean; data?: { isInWishlist: boolean }; error?: string }> {
    try {
      const response = await apiService.request<{ isInWishlist: boolean }>(`/users/wishlist/check/${productId}`);
      return response;
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
      return { success: false, error: 'Failed to check wishlist status' };
    }
  }

  // Toggle wishlist item (add if not present, remove if present)
  async toggleWishlistItem(productId: string): Promise<{ success: boolean; added: boolean; error?: string }> {
    try {
      // First check if item is in wishlist
      const checkResponse = await this.isInWishlist(productId);
      
      if (!checkResponse.success) {
        return { success: false, added: false, error: checkResponse.error };
      }

      const isInWishlist = checkResponse.data?.isInWishlist || false;

      if (isInWishlist) {
        // Remove from wishlist
        const removeResponse = await this.removeFromWishlist(productId);
        return {
          success: removeResponse.success,
          added: false,
          error: removeResponse.error
        };
      } else {
        // Add to wishlist
        const addResponse = await this.addToWishlist(productId);
        return {
          success: addResponse.success,
          added: true,
          error: addResponse.error
        };
      }
    } catch (error) {
      console.error('Failed to toggle wishlist item:', error);
      return { success: false, added: false, error: 'Failed to toggle wishlist item' };
    }
  }
}

export default new WishlistService();
