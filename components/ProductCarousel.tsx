import React, { useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, EyeIcon, ArrowsRightLeftIcon, ShoppingCartIcon } from './icons';
import type { ClothingItem } from '../types';

interface ProductCarouselProps {
  products: ClothingItem[];
  onProductClick: (product: ClothingItem) => void;
  onAddToCart: (product: ClothingItem) => void;
  onQuickView: (product: ClothingItem) => void;
  title: string;
  subtitle?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  onProductClick,
  onAddToCart,
  onQuickView,
  title,
  subtitle
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const itemsPerView = 4; // Number of items visible at once
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.scrollWidth / products.length;
      scrollContainerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(newIndex);
  };

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
    onQuickView(product);
  };

  const handleAddToCartClick = (product: ClothingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto container-padding">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-heading-2 md:text-heading-1 text-primary mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-body-lg text-secondary max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronLeftIcon className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronRightIcon className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-hidden"
            style={{ scrollBehavior: 'smooth' }}
          >
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
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 flex-shrink-0"
                  style={{ width: '280px' }}
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
                      <div className="absolute top-4 left-4 bg-error text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{discountPercentage}%
                      </div>
                    )}

                    {/* Hot Sale Badge */}
                    {product.tags?.includes('hot') && (
                      <div className="absolute top-4 right-4 bg-warning text-white px-3 py-1 rounded-full text-sm font-bold">
                        HOT SALE
                      </div>
                    )}

                    {/* Action Buttons Overlay */}
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <button
                        onClick={(e) => handleQuickView(product, e)}
                        className="bg-white text-primary p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        title="Quick View"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleWishlistToggle(product.id, e)}
                        className={`p-3 rounded-full transition-colors duration-200 ${
                          isWishlisted 
                            ? 'bg-error text-white' 
                            : 'bg-white text-primary hover:bg-gray-100'
                        }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        className="bg-white text-primary p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
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
                        className="w-full bg-white text-primary py-3 px-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
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
                    <div className="flex items-center gap-2">
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
