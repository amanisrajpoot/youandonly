import apiService from './apiService';
import { CLOTHING_CATALOG } from '../constants';
import type { ClothingItem, SearchFilters, SortOption, ProductVariant } from '../types';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: string;
  tags: string[];
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    isPrimary: boolean;
    order: number;
  }>;
  variants: Array<{
    id: string;
    name: string;
    sku?: string;
    price: number;
    stock: number;
    attributes: Record<string, any>;
    isActive: boolean;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    title?: string;
    comment?: string;
    user: {
      firstName: string;
      lastName: string;
    };
    createdAt: string;
  }>;
  _count?: {
    reviews: number;
  };
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ProductService {
  // Get products with filtering and pagination
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
    inStock?: boolean;
    tags?: string[];
  } = {}): Promise<{ success: boolean; data?: ProductsResponse; error?: string }> {
    try {
      const response = await apiService.getProducts(params);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      };
    }
  }

  // Search products with advanced filters
  async searchProducts(filters: SearchFilters, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<ClothingItem[]> {
    try {
      const response = await this.getProducts({
        search: filters.search,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        inStock: filters.inStock,
        tags: filters.tags?.join(','),
        sortBy,
        sortOrder,
        limit: 100
      });

      if (response.success && response.data) {
        return response.data.products.map(this.convertToClothingItem);
      }
    } catch (error) {
      console.warn('Failed to search products from API, using local data');
    }

    // Fallback to local search
    let results = CLOTHING_CATALOG;

    if (filters.search) {
      const searchQuery = filters.search.toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
      );
    }

    if (filters.category) {
      results = results.filter(item => item.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(item => item.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(item => item.price <= filters.maxPrice!);
    }

    if (filters.inStock) {
      results = results.filter(item => item.inStock !== false);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(item => 
        item.tags && filters.tags!.some(tag => item.tags!.includes(tag))
      );
    }

    // Apply sorting
    if (sortBy) {
      results.sort((a, b) => {
        let aValue = a[sortBy as keyof ClothingItem];
        let bValue = b[sortBy as keyof ClothingItem];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = (bValue as string).toLowerCase();
        }

        if (sortOrder === 'desc') {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }

    return results;
  }

  // Get available sort options
  getSortOptions(): SortOption[] {
    return [
      { field: 'name', direction: 'asc', label: 'Name A-Z' },
      { field: 'name', direction: 'desc', label: 'Name Z-A' },
      { field: 'price', direction: 'asc', label: 'Price Low to High' },
      { field: 'price', direction: 'desc', label: 'Price High to Low' },
      { field: 'createdAt', direction: 'desc', label: 'Newest First' },
      { field: 'createdAt', direction: 'asc', label: 'Oldest First' },
    ];
  }

  // Get product variants
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    try {
      const response = await apiService.request<{ variants: ProductVariant[] }>(`/products/${productId}/variants`);
      if (response.success && response.data) {
        return response.data.variants;
      }
    } catch (error) {
      console.warn('Failed to fetch product variants from API');
    }

    // Fallback - return empty array
    return [];
  }

  // Check product availability
  async checkProductAvailability(productId: string, variantId?: string, quantity: number = 1): Promise<boolean> {
    try {
      const response = await apiService.request<{ available: boolean }>(`/products/${productId}/availability`, {
        method: 'POST',
        body: JSON.stringify({ variantId, quantity }),
      });
      
      if (response.success && response.data) {
        return response.data.available;
      }
    } catch (error) {
      console.warn('Failed to check product availability from API');
    }

    // Fallback - assume available
    return true;
  }

  // Get single product by slug
  async getProduct(slug: string): Promise<{ success: boolean; data?: { product: Product }; error?: string }> {
    try {
      const response = await apiService.getProduct(slug);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product',
      };
    }
  }

  // Get related products
  async getRelatedProducts(slug: string, limit = 4): Promise<{ success: boolean; data?: { products: Product[] }; error?: string }> {
    try {
      const response = await apiService.getRelatedProducts(slug, limit);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch related products',
      };
    }
  }

  // Get categories
  async getCategories(): Promise<{ success: boolean; data?: { categories: any[] }; error?: string }> {
    try {
      const response = await apiService.getCategories();
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      };
    }
  }

  // Get featured products (fallback to local data if API fails)
  async getFeaturedProducts(): Promise<ClothingItem[]> {
    try {
      const response = await this.getProducts({ featured: true, limit: 4 });
      if (response.success && response.data) {
        // Convert API products to ClothingItem format for compatibility
        return response.data.products.map(this.convertToClothingItem);
      }
    } catch (error) {
      console.warn('Failed to fetch featured products from API, using local data');
    }

    // Fallback to local data
    return CLOTHING_CATALOG.filter(item => [21, 7, 12, 19].includes(item.id));
  }

  // Get all products (fallback to local data if API fails)
  async getAllProducts(): Promise<ClothingItem[]> {
    try {
      const response = await this.getProducts({ limit: 100 });
      if (response.success && response.data) {
        return response.data.products.map(this.convertToClothingItem);
      }
    } catch (error) {
      console.warn('Failed to fetch products from API, using local data');
    }

    // Fallback to local data
    return CLOTHING_CATALOG;
  }

  // Convert API Product to ClothingItem format
  private convertToClothingItem(product: Product): ClothingItem {
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
    
    return {
      id: parseInt(product.id) || 0, // Convert string ID to number for compatibility
      name: product.name,
      category: product.category.name as 'Top' | 'Bottom' | 'Shoes' | 'Accessory' | 'Outerwear',
      imageUrl: primaryImage?.url || 'https://picsum.photos/400/600',
      price: product.price,
      description: product.description,
    };
  }


  // Get products by category
  async getProductsByCategory(categorySlug: string): Promise<ClothingItem[]> {
    try {
      const response = await this.getProducts({ category: categorySlug, limit: 100 });
      if (response.success && response.data) {
        return response.data.products.map(this.convertToClothingItem);
      }
    } catch (error) {
      console.warn('Failed to fetch products by category from API, using local data');
    }

    // Fallback to local data
    const categoryMap: Record<string, string> = {
      'tops': 'Top',
      'bottoms': 'Bottom',
      'shoes': 'Shoes',
      'accessories': 'Accessory',
      'outerwear': 'Outerwear',
    };

    const categoryName = categoryMap[categorySlug];
    if (categoryName) {
      return CLOTHING_CATALOG.filter(item => item.category === categoryName);
    }

    return CLOTHING_CATALOG;
  }
}

export const productService = new ProductService();
export default productService;
