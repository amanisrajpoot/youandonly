import React, { useState, useMemo, useEffect } from 'react';
import type { ClothingItem, SearchFilters, SortOption } from '../types';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from './LoadingSpinner';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import productService from '../services/productService';

interface CatalogPageProps {
  onProductClick: (item: ClothingItem) => void;
}

const categories = ['All', 'Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'];

export const CatalogPage: React.FC<CatalogPageProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [currentSort, setCurrentSort] = useState('name-asc');
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = productService.getSortOptions();

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

  // Search and filter products
  const filteredItems = useMemo(async () => {
    const [field, direction] = currentSort.split('-');
    const searchFilters: SearchFilters = {
      ...filters,
      search: searchQuery || undefined,
    };
    
    return await productService.searchProducts(searchFilters, field, direction as 'asc' | 'desc');
  }, [products, filters, searchQuery, currentSort]);

  const [displayedItems, setDisplayedItems] = useState<ClothingItem[]>([]);

  // Update displayed items when filtered items change
  useEffect(() => {
    filteredItems.then(items => setDisplayedItems(items));
  }, [filteredItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setCurrentSort(`${field}-${direction}`);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <section className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-heading-2 md:text-heading-1 text-primary mb-4">
          Explore The Collection
        </h2>
        <p className="text-body-lg text-secondary">
          Browse our curated catalog of futuristic and classic pieces.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search products, categories, or tags..."
              className="w-full"
            />
          </div>
          
          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-accent hover:bg-accent-hover text-white px-4 py-3 rounded-lg transition-colors"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-secondary">
            {isLoading ? 'Loading...' : `${displayedItems.length} products found`}
          </p>
          {(searchQuery || Object.keys(filters).length > 0) && (
            <button
              onClick={clearAllFilters}
              className="text-accent hover:text-accent-hover text-body-sm underline transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Panel */}
        <div className="lg:w-80">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            sortOptions={sortOptions}
            currentSort={currentSort}
            onSortChange={handleSortChange}
            className={showFilters ? 'block' : 'hidden lg:block'}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner className="w-8 h-8" />
              <span className="ml-3 text-secondary">Loading products...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-error text-body-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-accent hover:text-accent-hover underline transition-colors"
              >
                Try again
              </button>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted text-body-lg mb-4">No products found matching your criteria</p>
              <button 
                onClick={clearAllFilters}
                className="text-accent hover:text-accent-hover underline transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {displayedItems.map(item => (
                <ProductCard key={item.id} product={item} onClick={() => onProductClick(item)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
