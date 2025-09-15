import React, { useState, useEffect } from 'react';
import { HeartIcon, EyeIcon, ArrowsRightLeftIcon, ShoppingCartIcon } from './icons';
import type { ClothingItem } from '../types';
import wishlistService from '../services/wishlistService';
import compareService from '../services/compareService';
import { useAuth } from '../contexts/AuthContext';

interface EnhancedProductCardProps {
  product: ClothingItem;
  view: 'grid' | 'list';
  onProductClick: (product: ClothingItem) => void;
  onQuickView: (product: ClothingItem) => void;
  onAddToCart: (product: ClothingItem) => void;
  onAddToWishlist: (product: ClothingItem) => void;
  onAddToCompare: (product: ClothingItem) => void;
}

export const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  view,
  onProductClick,
  onQuickView,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare
}) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isInCompare, setIsInCompare] = useState(false);
  const [isTogglingCompare, setIsTogglingCompare] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  // Check if product is in wishlist and compare
  useEffect(() => {
    if (user) {
      const checkStatuses = async () => {
        try {
          const [wishlistResponse, compareResponse] = await Promise.all([
            wishlistService.isInWishlist(product.id.toString()),
            compareService.isInCompare(product.id.toString())
          ]);
          
          if (wishlistResponse.success && wishlistResponse.data) {
            setIsWishlisted(wishlistResponse.data.isInWishlist);
          }
          
          if (compareResponse.success && compareResponse.data) {
            setIsInCompare(compareResponse.data.isInCompare);
          }
        } catch (error) {
          console.error('Failed to check product status:', error);
        }
      };
      checkStatuses();
    }
  }, [user, product.id]);

  // Mock product images (in real app, this would come from product data)
  const productImages = [
    product.image,
    product.image, // In real app, these would be different angles
    product.image,
    product.image
  ];

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      // If not logged in, show login modal or redirect
      onAddToWishlist(product); // This will trigger the login flow
      return;
    }

    try {
      setIsTogglingWishlist(true);
      const response = await wishlistService.toggleWishlistItem(product.id.toString());
      
      if (response.success) {
        setIsWishlisted(response.added);
        onAddToWishlist(product); // Notify parent component
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleCompareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      // If not logged in, show login modal or redirect
      onAddToCompare(product); // This will trigger the login flow
      return;
    }

    try {
      setIsTogglingCompare(true);
      const response = await compareService.toggleCompareItem(product.id.toString());
      
      if (response.success) {
        setIsInCompare(response.added);
        onAddToCompare(product); // Notify parent component
      }
    } catch (error) {
      console.error('Failed to toggle compare:', error);
    } finally {
      setIsTogglingCompare(false);
    }
  };

  if (view === 'list') {
    return (
      <div 
        className="flex bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onProductClick(product)}
      >
        {/* Image */}
        <div className="w-48 h-48 flex-shrink-0 relative">
          <img
            src={productImages[currentImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Sale Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{discountPercentage}%
            </div>
          )}

          {/* Hot Sale Badge */}
          {product.tags?.includes('hot') && (
            <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-xs font-bold">
              HOT SALE
            </div>
          )}

          {/* Quick Actions */}
          <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={handleQuickViewClick}
              className="bg-white text-primary p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Quick View"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleWishlistToggle}
              disabled={isTogglingWishlist}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-primary hover:bg-gray-100'
              } ${isTogglingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isTogglingWishlist ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <HeartIcon className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              )}
            </button>
            <button
              onClick={handleCompareClick}
              disabled={isTogglingCompare}
              className={`p-2 rounded-full transition-colors ${
                isInCompare 
                  ? 'bg-accent text-white' 
                  : 'bg-white text-primary hover:bg-gray-100'
              } ${isTogglingCompare ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isInCompare ? "Remove from Compare" : "Add to Compare"}
            >
              {isTogglingCompare ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <ArrowsRightLeftIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-heading-4 text-primary font-bold mb-2">{product.name}</h3>
              <p className="text-body-sm text-muted mb-4">{product.category}</p>
            </div>
            <button
              onClick={handleWishlistToggle}
              disabled={isTogglingWishlist}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'text-muted hover:text-red-500'
              } ${isTogglingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isTogglingWishlist ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              ) : (
                <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              )}
            </button>
          </div>

          <p className="text-body text-secondary mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-heading-4 text-primary font-bold">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-body text-gray-400 line-through">
                  ${product.comparePrice!.toFixed(2)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCartClick}
              className="bg-accent hover:bg-accent-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onProductClick(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={productImages[currentImage]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Sale Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}

        {/* Hot Sale Badge */}
        {product.tags?.includes('hot') && (
          <div className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded text-xs font-bold">
            HOT SALE
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleQuickViewClick}
            className="bg-white text-primary p-3 rounded-full hover:bg-gray-100 transition-colors"
            title="Quick View"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleWishlistToggle}
            disabled={isTogglingWishlist}
            className={`p-3 rounded-full transition-colors ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-primary hover:bg-gray-100'
            } ${isTogglingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isTogglingWishlist ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : (
              <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            )}
          </button>
          <button
            onClick={handleCompareClick}
            disabled={isTogglingCompare}
            className={`p-3 rounded-full transition-colors ${
              isInCompare 
                ? 'bg-accent text-white' 
                : 'bg-white text-primary hover:bg-gray-100'
            } ${isTogglingCompare ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isInCompare ? "Remove from Compare" : "Add to Compare"}
          >
            {isTogglingCompare ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : (
              <ArrowsRightLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Hot Sale Strip */}
        {product.tags?.includes('hot') && (
          <div className="absolute bottom-0 left-0 right-0 bg-black text-red-500 text-center py-1 text-xs font-bold uppercase">
            HOT SALE 25% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-body font-bold text-primary mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-body font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-body-sm text-gray-400 line-through">
              ${product.comparePrice!.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCartClick}
          className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCartIcon className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
