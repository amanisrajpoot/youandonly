import React, { useState } from 'react';
import { XMarkIcon } from './icons';

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  availability: string[];
  brands: string[];
  saleOnly: boolean;
}

interface AdvancedFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterState) => void;
  filters: FilterState;
}

const categories = [
  { name: 'All Products', count: 1247 },
  { name: 'Tops', count: 234 },
  { name: 'Dresses', count: 189 },
  { name: 'Bottoms', count: 156 },
  { name: 'Outerwear', count: 98 },
  { name: 'Shoes', count: 145 },
  { name: 'Accessories', count: 203 },
  { name: 'Bags', count: 67 },
  { name: 'Jewelry', count: 89 }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

const colors = [
  { name: 'Beige', value: 'beige', class: 'bg-amber-100' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-400' },
  { name: 'Black', value: 'black', class: 'bg-black' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Grey', value: 'grey', class: 'bg-gray-400' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'White', value: 'white', class: 'bg-white border border-gray-300' },
  { name: 'Dark Blue', value: 'dark-blue', class: 'bg-blue-800' },
  { name: 'Light Blue', value: 'light-blue', class: 'bg-blue-300' }
];

const brands = [
  { name: 'Nike', count: 45 },
  { name: 'Louis Vuitton', count: 23 },
  { name: 'Hermes', count: 18 },
  { name: 'Chanel', count: 31 },
  { name: 'Gucci', count: 27 },
  { name: 'Prada', count: 19 },
  { name: 'Zara', count: 67 },
  { name: 'H&M', count: 89 }
];

const availability = [
  { name: 'In Stock', count: 1156 },
  { name: 'Out of Stock', count: 91 }
];

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  filters
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleCategoryToggle = (category: string) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    
    setLocalFilters({ ...localFilters, categories: newCategories });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = localFilters.sizes.includes(size)
      ? localFilters.sizes.filter(s => s !== size)
      : [...localFilters.sizes, size];
    
    setLocalFilters({ ...localFilters, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const newColors = localFilters.colors.includes(color)
      ? localFilters.colors.filter(c => c !== color)
      : [...localFilters.colors, color];
    
    setLocalFilters({ ...localFilters, colors: newColors });
  };

  const handleAvailabilityToggle = (avail: string) => {
    const newAvailability = localFilters.availability.includes(avail)
      ? localFilters.availability.filter(a => a !== avail)
      : [...localFilters.availability, avail];
    
    setLocalFilters({ ...localFilters, availability: newAvailability });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand];
    
    setLocalFilters({ ...localFilters, brands: newBrands });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setLocalFilters({ ...localFilters, priceRange: [min, max] });
  };

  const handleSaleOnlyToggle = () => {
    setLocalFilters({ ...localFilters, saleOnly: !localFilters.saleOnly });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const resetFilters = () => {
    const resetFilters: FilterState = {
      categories: [],
      priceRange: [0, 1000],
      sizes: [],
      colors: [],
      availability: [],
      brands: [],
      saleOnly: false
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="flex-1 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Filter Panel */}
      <div className="w-96 bg-white h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-heading-3 text-primary font-bold">FILTERS</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-primary transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Categories */}
          <div>
            <h3 className="text-heading-4 text-primary font-semibold mb-4">CATEGORIES</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.name} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.categories.includes(category.name)}
                      onChange={() => handleCategoryToggle(category.name)}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="ml-3 text-body text-primary">{category.name}</span>
                  </div>
                  <span className="text-body-sm text-muted">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-heading-4 text-primary font-semibold mb-4">PRICE RANGE</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-body-sm text-secondary mb-1">Min</label>
                  <input
                    type="number"
                    value={localFilters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), localFilters.priceRange[1])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-body-sm text-secondary mb-1">Max</label>
                  <input
                    type="number"
                    value={localFilters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(localFilters.priceRange[0], Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(localFilters.priceRange[0], Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-heading-4 text-primary font-semibold mb-4">SIZE</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded-full text-body-sm font-medium transition-colors ${
                    localFilters.sizes.includes(size)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-primary hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-heading-4 text-primary font-semibold mb-4">COLOR</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorToggle(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    localFilters.colors.includes(color.value)
                      ? 'border-primary scale-110'
                      : 'border-gray-300 hover:scale-105'
                  } ${color.class}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-heading-4 text-primary font-semibold mb-4">AVAILABILITY</h3>
            <div className="space-y-2">
              {availability.map((avail) => (
                <label key={avail.name} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.availability.includes(avail.name)}
                      onChange={() => handleAvailabilityToggle(avail.name)}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="ml-3 text-body text-primary">{avail.name}</span>
                  </div>
                  <span className="text-body-sm text-muted">({avail.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-heading-4 text-primary font-semibold mb-4">BRANDS</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand.name} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.brands.includes(brand.name)}
                      onChange={() => handleBrandToggle(brand.name)}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="ml-3 text-body text-primary">{brand.name}</span>
                  </div>
                  <span className="text-body-sm text-muted">({brand.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sale Only */}
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.saleOnly}
                onChange={handleSaleOnlyToggle}
                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
              />
              <span className="ml-3 text-body text-primary font-medium">Shop sale items only</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
          <button
            onClick={resetFilters}
            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            RESET FILTERS
          </button>
          <button
            onClick={applyFilters}
            className="w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-hover transition-colors"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};
