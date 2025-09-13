import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import type { SearchFilters, SortOption } from '../types';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  sortOptions: SortOption[];
  currentSort: string;
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  sortOptions,
  currentSort,
  onSortChange,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Top', label: 'Tops' },
    { value: 'Bottom', label: 'Bottoms' },
    { value: 'Shoes', label: 'Shoes' },
    { value: 'Accessory', label: 'Accessories' },
    { value: 'Outerwear', label: 'Outerwear' },
  ];

  const priceRanges = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: undefined },
  ];

  const popularTags = [
    'casual', 'formal', 'summer', 'winter', 'vintage', 'modern', 'minimalist', 'streetwear'
  ];

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category || undefined });
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    onFiltersChange({ 
      ...filters, 
      minPrice: min, 
      maxPrice: max 
    });
  };

  const handleInStockChange = (inStock: boolean) => {
    onFiltersChange({ ...filters, inStock });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && value !== '' && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className={`bg-gray-800/40 border border-gray-700 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-cyan-400 hover:text-cyan-300 underline"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category.value} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={filters.category === category.value}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.minPrice === range.min && 
                    filters.maxPrice === range.max
                  }
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Availability</h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-300">In Stock Only</span>
          </label>
        </div>

        {/* Tags Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filters.tags?.includes(tag)
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Sort By</h4>
          <select
            value={currentSort}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              onSortChange(field, direction as 'asc' | 'desc');
            }}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {sortOptions.map(option => (
              <option key={`${option.field}-${option.direction}`} value={`${option.field}-${option.direction}`}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
