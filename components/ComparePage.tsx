import React, { useState, useEffect } from 'react';
import { XMarkIcon, ShoppingCartIcon, EyeIcon, TrashIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import compareService, { CompareItem } from '../services/compareService';
import { ClothingItem } from '../types';

interface ComparePageProps {
  onProductClick: (product: ClothingItem) => void;
  onAddToCart: (item: ClothingItem, quantity?: number) => void;
  onBack: () => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  onProductClick,
  onAddToCart,
  onBack
}) => {
  const { user } = useAuth();
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadCompareList();
    }
  }, [user]);

  const loadCompareList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await compareService.getCompareList();
      
      if (response.success && response.data) {
        setCompareItems(response.data.compareItems);
      } else {
        setError(response.error || 'Failed to load compare list');
      }
    } catch (err) {
      setError('Failed to load compare list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCompare = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId));
      const response = await compareService.removeFromCompare(productId);
      
      if (response.success) {
        setCompareItems(prev => prev.filter(item => item.productId !== productId));
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

  const handleAddToCart = (compareItem: CompareItem) => {
    const product: ClothingItem = {
      id: parseInt(compareItem.product.id),
      name: compareItem.product.name,
      price: compareItem.product.price,
      image: compareItem.product.images[0]?.url || '/placeholder-product.jpg',
      category: compareItem.product.category.name,
      description: compareItem.product.description,
      tags: compareItem.product.tags
    };
    onAddToCart(product);
  };

  const handleProductClick = (compareItem: CompareItem) => {
    const product: ClothingItem = {
      id: parseInt(compareItem.product.id),
      name: compareItem.product.name,
      price: compareItem.product.price,
      image: compareItem.product.images[0]?.url || '/placeholder-product.jpg',
      category: compareItem.product.category.name,
      description: compareItem.product.description,
      tags: compareItem.product.tags
    };
    onProductClick(product);
  };

  const handleClearAll = async () => {
    try {
      const response = await compareService.clearCompareList();
      if (response.success) {
        setCompareItems([]);
      } else {
        setError(response.error || 'Failed to clear compare list');
      }
    } catch (err) {
      setError('Failed to clear compare list');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-heading-1 text-primary mb-4">Compare Products</h1>
            <p className="text-body-lg text-secondary mb-8">Please log in to compare products</p>
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
            <p className="text-body-lg text-secondary">Loading compare list...</p>
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
            <h1 className="text-heading-1 text-primary">Compare Products</h1>
            <p className="text-body-lg text-secondary mt-2">
              {compareItems.length} {compareItems.length === 1 ? 'item' : 'items'} to compare
            </p>
          </div>
          <div className="flex gap-4">
            {compareItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-error hover:bg-error/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onBack}
              className="bg-white hover:bg-gray-50 text-primary border border-light px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {compareItems.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <XMarkIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-heading-2 text-primary mb-2">No products to compare</h2>
            <p className="text-body-lg text-secondary mb-8">
              Add products to compare their features and prices
            </p>
            <button
              onClick={onBack}
              className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Compare Table */}
        {compareItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-body-sm font-semibold text-primary">
                      Product
                    </th>
                    {compareItems.map((item) => (
                      <th key={item.id} className="px-6 py-4 text-center text-body-sm font-semibold text-primary relative">
                        <button
                          onClick={() => handleRemoveFromCompare(item.productId)}
                          disabled={removingItems.has(item.productId)}
                          className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                        >
                          {removingItems.has(item.productId) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <XMarkIcon className="h-4 w-4 text-red-500" />
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Product Images */}
                  <tr>
                    <td className="px-6 py-4 text-body-sm font-medium text-primary">Image</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center">
                        <div className="w-32 h-32 mx-auto relative group">
                          <img
                            src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
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
                      </td>
                    ))}
                  </tr>

                  {/* Product Names */}
                  <tr>
                    <td className="px-6 py-4 text-body-sm font-medium text-primary">Name</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center">
                        <h3 className="text-heading-4 text-primary font-semibold mb-2">
                          {item.product.name}
                        </h3>
                        <p className="text-body-sm text-muted">
                          {item.product.category.name}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Prices */}
                  <tr>
                    <td className="px-6 py-4 text-body-sm font-medium text-primary">Price</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-body-lg font-semibold text-primary">
                            ${item.product.price.toFixed(2)}
                          </span>
                          {item.product.comparePrice && item.product.comparePrice > item.product.price && (
                            <span className="text-body-sm text-muted line-through">
                              ${item.product.comparePrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* SKU */}
                  <tr>
                    <td className="px-6 py-4 text-body-sm font-medium text-primary">SKU</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center">
                        <span className="text-body-sm text-muted">
                          {item.product.sku || 'N/A'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Availability */}
                  <tr>
                    <td className="px-6 py-4 text-body-sm font-medium text-primary">Availability</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.product.isActive 
                            ? 'bg-success/10 text-success' 
                            : 'bg-error/10 text-error'
                        }`}>
                          {item.product.isActive ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Tags */}
                  <tr>
                    <td className="px-6 py-4 text-body-sm font-medium text-primary">Tags</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {item.product.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="px-6 py-4 text-body-sm font-medium text-primary">Actions</td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleProductClick(item)}
                            className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-body-sm font-semibold transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-body-sm font-semibold transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
