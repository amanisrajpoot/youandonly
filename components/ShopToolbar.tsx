import React, { useState } from 'react';
import { ChevronDownIcon, Squares2X2Icon, ListBulletIcon } from './icons';

interface ShopToolbarProps {
  totalProducts: number;
  onSortChange: (sort: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  onFiltersToggle: () => void;
  onSaleOnlyToggle: (saleOnly: boolean) => void;
  currentSort: string;
  currentView: 'grid' | 'list';
  saleOnly: boolean;
}

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' }
];

export const ShopToolbar: React.FC<ShopToolbarProps> = ({
  totalProducts,
  onSortChange,
  onViewChange,
  onFiltersToggle,
  onSaleOnlyToggle,
  currentSort,
  currentView,
  saleOnly
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Default';

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Results count and Sale toggle */}
          <div className="flex items-center gap-6">
            <p className="text-body text-secondary">
              {totalProducts} products found
            </p>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={saleOnly}
                onChange={(e) => onSaleOnlyToggle(e.target.checked)}
                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
              />
              <span className="ml-2 text-body text-primary font-medium">Shop sale items only</span>
            </label>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <span className="text-body text-primary">Sort by ({currentSortLabel})</span>
                <ChevronDownIcon className="w-4 h-4 text-muted" />
              </button>

              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-body hover:bg-gray-50 transition-colors ${
                        currentSort === option.value ? 'bg-gray-50 text-accent' : 'text-primary'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => onViewChange('grid')}
                className={`p-2 transition-colors ${
                  currentView === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary hover:bg-gray-50'
                }`}
                title="Grid View"
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 transition-colors ${
                  currentView === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary hover:bg-gray-50'
                }`}
                title="List View"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Filters Button */}
            <button
              onClick={onFiltersToggle}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              FILTERS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
