import React, { useState, useEffect } from 'react';
import { HeartIcon, ShoppingCartIcon, EyeIcon, TrashIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import wishlistService, { WishlistItem } from '../services/wishlistService';
import { ClothingItem } from '../types';

interface WishlistPageProps {
  onProductClick: (product: ClothingItem) => void;
  onAddToCart: (item: ClothingItem, quantity?: number) => void;
  onBack: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onProductClick,
  onAddToCart,
  onBack
}) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await wishlistService.getWishlist();
      
      if (response.success && response.data) {
        setWishlistItems(response.data.wishlistItems);
      } else {
        setError(response.error || 'Failed to load wishlist');
      }
    } catch (err) {
      setError('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId));
      const response = await wishlistService.removeFromWishlist(productId);
      
      if (response.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      } else {
        setError(response.error || 'Failed to remove item');
      }
    } catch (err) {
      setError('Failed to remove item');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = (wishlistItem: WishlistItem) => {
    const product: ClothingItem = {
      id: parseInt(wishlistItem.product.id),
      name: wishlistItem.product.name,
      price: wishlistItem.product.price,
      image: wishlistItem.product.images[0]?.url || '/placeholder-product.jpg',
      category: wishlistItem.product.category.name,
      description: wishlistItem.product.description,
      tags: wishlistItem.product.tags
    };
    onAddToCart(product);
  };

  const handleProductClick = (wishlistItem: WishlistItem) => {
    const product: ClothingItem = {
      id: parseInt(wishlistItem.product.id),
      name: wishlistItem.product.name,
      price: wishlistItem.product.price,
      image: wishlistItem.product.images[0]?.url || '/placeholder-product.jpg',
      category: wishlistItem.product.category.name,
      description: wishlistItem.product.description,
      tags: wishlistItem.product.tags
    };
    onProductClick(product);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-heading-1 text-primary mb-4">My Wishlist</h1>
            <p className="text-body-lg text-secondary mb-8">Please log in to view your wishlist</p>
            <button
              onClick={onBack}
              className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-body-lg text-secondary">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-heading-1 text-primary">My Wishlist</h1>
            <p className="text-body-lg text-secondary mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-white hover:bg-gray-50 text-primary border border-light px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Shop
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {wishlistItems.length === 0 && !error && (
          <div className="text-center py-16">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-heading-2 text-primary mb-2">Your wishlist is empty</h2>
            <p className="text-body-lg text-secondary mb-8">
              Start adding items you love to your wishlist
            </p>
            <button
              onClick={onBack}
              className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Remove from wishlist button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    disabled={removingItems.has(item.productId)}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors disabled:opacity-50"
                  >
                    {removingItems.has(item.productId) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    )}
                  </button>

                  {/* Quick actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleProductClick(item)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                        title="Quick view"
                      >
                        <EyeIcon className="h-4 w-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                        title="Add to cart"
                      >
                        <ShoppingCartIcon className="h-4 w-4 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-heading-4 text-primary font-semibold mb-2 line-clamp-2">
                    {item.product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-body-lg font-semibold text-primary">
                        ${item.product.price.toFixed(2)}
                      </span>
                      {item.product.comparePrice && item.product.comparePrice > item.product.price && (
                        <span className="text-body-sm text-muted line-through">
                          ${item.product.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {item.product.comparePrice && item.product.comparePrice > item.product.price && (
                      <span className="bg-error text-white text-xs px-2 py-1 rounded">
                        Sale
                      </span>
                    )}
                  </div>

                  <p className="text-body-sm text-secondary mb-4 line-clamp-2">
                    {item.product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-muted">
                      {item.product.category.name}
                    </span>
                    <span className="text-body-sm text-muted">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
