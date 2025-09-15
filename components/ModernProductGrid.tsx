import React, { useState } from 'react';
import { HeartIcon, EyeIcon, ArrowsRightLeftIcon, ShoppingCartIcon } from './icons';
import type { ClothingItem } from '../types';

interface ModernProductGridProps {
  products: ClothingItem[];
  onProductClick: (product: ClothingItem) => void;
  onAddToCart: (product: ClothingItem) => void;
  title: string;
  subtitle?: string;
}

const ModernProductGrid: React.FC<ModernProductGridProps> = ({
  products,
  onProductClick,
  onAddToCart,
  title,
  subtitle
}) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const handleWishlistToggle = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleQuickView = (product: ClothingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onProductClick(product);
  };

  const handleAddToCartClick = (product: ClothingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto container-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-heading-2 md:text-heading-1 text-primary mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-body-lg text-secondary max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const isHovered = hoveredProduct === product.id;
            const isWishlisted = wishlist.has(product.id);
            const hasDiscount = product.comparePrice && product.comparePrice > product.price;
            const discountPercentage = hasDiscount 
              ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => onProductClick(product)}
              >
                {/* Product Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{discountPercentage}%
                    </div>
                  )}

                  {/* Hot Sale Badge */}
                  {product.tags?.includes('hot') && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      HOT SALE
                    </div>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <button
                      onClick={(e) => handleQuickView(product, e)}
                      className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      title="Quick View"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleWishlistToggle(product.id, e)}
                      className={`p-3 rounded-full transition-colors duration-200 ${
                        isWishlisted 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      }`}
                      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      title="Compare"
                    >
                      <ArrowsRightLeftIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quick Add Button */}
                  <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                    isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <button
                      onClick={(e) => handleAddToCartClick(product, e)}
                      className="w-full bg-white text-gray-900 py-3 px-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-heading-4 text-primary mb-3 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-lg text-muted line-through">
                        ${product.comparePrice!.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Color Variants */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-body-sm text-secondary">Colors:</span>
                    <div className="flex gap-1">
                      {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'].map((color, index) => (
                        <div
                          key={index}
                          className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Options */}
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm text-secondary">Sizes:</span>
                    <div className="flex gap-1">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button
                          key={size}
                          className="w-8 h-8 text-xs font-medium text-secondary hover:text-primary hover:bg-tertiary rounded-full transition-colors duration-200"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModernProductGrid;
