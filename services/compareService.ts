import apiService from './apiService';

export interface CompareItem {
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

class CompareService {
  // Get user compare list
  async getCompareList(): Promise<{ success: boolean; data?: { compareItems: CompareItem[] }; error?: string }> {
    try {
      const response = await apiService.request<{ compareItems: CompareItem[] }>('/users/compare');
      return response;
    } catch (error) {
      console.error('Failed to get compare list:', error);
      return { success: false, error: 'Failed to get compare list' };
    }
  }

  // Add item to compare
  async addToCompare(productId: string): Promise<{ success: boolean; data?: { compareItem: CompareItem }; error?: string }> {
    try {
      const response = await apiService.request<{ compareItem: CompareItem }>('/users/compare', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      return response;
    } catch (error) {
      console.error('Failed to add to compare:', error);
      return { success: false, error: 'Failed to add to compare' };
    }
  }

  // Remove item from compare
  async removeFromCompare(productId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.request(`/users/compare/${productId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Failed to remove from compare:', error);
      return { success: false, error: 'Failed to remove from compare' };
    }
  }

  // Check if product is in compare
  async isInCompare(productId: string): Promise<{ success: boolean; data?: { isInCompare: boolean }; error?: string }> {
    try {
      const response = await apiService.request<{ isInCompare: boolean }>(`/users/compare/check/${productId}`);
      return response;
    } catch (error) {
      console.error('Failed to check compare status:', error);
      return { success: false, error: 'Failed to check compare status' };
    }
  }

  // Toggle compare item (add if not present, remove if present)
  async toggleCompareItem(productId: string): Promise<{ success: boolean; added: boolean; error?: string }> {
    try {
      // First check if item is in compare
      const checkResponse = await this.isInCompare(productId);
      
      if (!checkResponse.success) {
        return { success: false, added: false, error: checkResponse.error };
      }

      const isInCompare = checkResponse.data?.isInCompare || false;

      if (isInCompare) {
        // Remove from compare
        const removeResponse = await this.removeFromCompare(productId);
        return {
          success: removeResponse.success,
          added: false,
          error: removeResponse.error
        };
      } else {
        // Add to compare
        const addResponse = await this.addToCompare(productId);
        return {
          success: addResponse.success,
          added: true,
          error: addResponse.error
        };
      }
    } catch (error) {
      console.error('Failed to toggle compare item:', error);
      return { success: false, added: false, error: 'Failed to toggle compare item' };
    }
  }

  // Clear all compare items
  async clearCompareList(): Promise<{ success: boolean; error?: string }> {
    try {
      const compareListResponse = await this.getCompareList();
      
      if (!compareListResponse.success || !compareListResponse.data) {
        return { success: false, error: 'Failed to get compare list' };
      }

      const compareItems = compareListResponse.data.compareItems;
      
      // Remove all items
      const removePromises = compareItems.map(item => this.removeFromCompare(item.productId));
      const results = await Promise.all(removePromises);
      
      const hasError = results.some(result => !result.success);
      
      return {
        success: !hasError,
        error: hasError ? 'Failed to clear some items' : undefined
      };
    } catch (error) {
      console.error('Failed to clear compare list:', error);
      return { success: false, error: 'Failed to clear compare list' };
    }
  }
}

export default new CompareService();
