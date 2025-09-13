
export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  attributes: Record<string, any>;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface ClothingItem {
  id: number;
  name: string;
  slug: string;
  category: 'Top' | 'Bottom' | 'Shoes' | 'Accessory' | 'Outerwear';
  imageUrl: string;
  price: number;
  comparePrice?: number;
  description: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  inStock?: boolean;
  tags?: string[];
}

export interface Outfit {
  outfitName: string;
  description: string;
  items: ClothingItem[];
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  search?: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}
