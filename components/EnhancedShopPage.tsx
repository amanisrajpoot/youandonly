import React, { useState, useEffect, useMemo } from 'react';
import { ShopHeroBanner } from './ShopHeroBanner';
import { ShopToolbar } from './ShopToolbar';
import { EnhancedProductCard } from './EnhancedProductCard';
import { AdvancedFilterPanel } from './AdvancedFilterPanel';
import { LoadingSpinner } from './LoadingSpinner';
import type { ClothingItem } from '../types';
import productService from '../services/productService';

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  availability: string[];
  brands: string[];
  saleOnly: boolean;
}

interface EnhancedShopPageProps {
  onProductClick: (product: ClothingItem) => void;
  onQuickView: (product: ClothingItem) => void;
  onAddToCart: (product: ClothingItem) => void;
  onAddToWishlist: (product: ClothingItem) => void;
  onAddToCompare: (product: ClothingItem) => void;
}

export const EnhancedShopPage: React.FC<EnhancedShopPageProps> = ({
  onProductClick,
  onQuickView,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare
}) => {
  const [products, setProducts] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [currentSort, setCurrentSort] = useState('default');
  const [saleOnly, setSaleOnly] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    sizes: [],
    colors: [],
    availability: [],
    brands: [],
    saleOnly: false
  });

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const items = await productService.getAllProducts();
        setProducts(items);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.some(category => 
          product.category.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (filters.sizes.length > 0) {
      // Mock size filtering - in real app, this would check product variants
      filtered = filtered.filter(() => Math.random() > 0.3); // Random filtering for demo
    }

    if (filters.colors.length > 0) {
      // Mock color filtering - in real app, this would check product variants
      filtered = filtered.filter(() => Math.random() > 0.3); // Random filtering for demo
    }

    if (filters.brands.length > 0) {
      // Mock brand filtering - in real app, this would check product brand
      filtered = filtered.filter(() => Math.random() > 0.3); // Random filtering for demo
    }

    if (filters.availability.includes('In Stock')) {
      // Mock availability filtering
      filtered = filtered.filter(() => Math.random() > 0.1); // Random filtering for demo
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    if (saleOnly || filters.saleOnly) {
      filtered = filtered.filter(product => 
        product.comparePrice && product.comparePrice > product.price
      );
    }

    // Apply sorting
    switch (currentSort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        // Mock newest sorting - in real app, this would use creation date
        filtered.sort(() => Math.random() - 0.5);
        break;
      case 'popular':
        // Mock popular sorting - in real app, this would use view count or sales
        filtered.sort(() => Math.random() - 0.5);
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [products, filters, currentSort, saleOnly]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
  };

  const handleViewChange = (view: 'grid' | 'list') => {
    setCurrentView(view);
  };

  const handleFiltersToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleSaleOnlyToggle = (saleOnly: boolean) => {
    setSaleOnly(saleOnly);
  };

  const breadcrumbs = [
    { label: 'Home' },
    { label: 'Shop' },
    { label: 'Women' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <ShopHeroBanner
        title="Women"
        breadcrumbs={breadcrumbs}
      />

      {/* Toolbar */}
      <ShopToolbar
        totalProducts={filteredProducts.length}
        onSortChange={handleSortChange}
        onViewChange={handleViewChange}
        onFiltersToggle={handleFiltersToggle}
        onSaleOnlyToggle={handleSaleOnlyToggle}
        currentSort={currentSort}
        currentView={currentView}
        saleOnly={saleOnly}
      />

      {/* Main Content */}
      <div className="container mx-auto container-padding py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner className="w-8 h-8" />
            <span className="ml-3 text-body text-secondary">Loading products...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-error text-body-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-accent hover:text-accent-hover underline transition-colors"
            >
              Try again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-body-lg mb-4">No products found matching your criteria</p>
            <button 
              onClick={() => {
                setFilters({
                  categories: [],
                  priceRange: [0, 1000],
                  sizes: [],
                  colors: [],
                  availability: [],
                  brands: [],
                  saleOnly: false
                });
                setSaleOnly(false);
              }}
              className="text-accent hover:text-accent-hover underline transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            currentView === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map(product => (
              <EnhancedProductCard
                key={product.id}
                product={product}
                view={currentView}
                onProductClick={onProductClick}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onAddToCompare={onAddToCompare}
              />
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filter Panel */}
      <AdvancedFilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
        filters={filters}
      />
    </div>
  );
};
