import React, { useState, useEffect } from 'react';
import type { ClothingItem, ProductVariant } from '../types';
import { ChevronLeftIcon } from './icons';
import { ProductVariantSelector } from './ProductVariantSelector';
import productService from '../services/productService';

interface ProductDetailPageProps {
  product: ClothingItem;
  onAddToCart: (item: ClothingItem) => void;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onAddToCart, onBack }) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Load product variants
  useEffect(() => {
    const loadVariants = async () => {
      setIsLoadingVariants(true);
      try {
        const productVariants = await productService.getProductVariants(product.id.toString());
        setVariants(productVariants);
      } catch (error) {
        console.error('Failed to load product variants:', error);
      } finally {
        setIsLoadingVariants(false);
      }
    };

    loadVariants();
  }, [product.id]);

  const handleVariantChange = (variant: ProductVariant | null) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    // Create a product item with variant information
    const productToAdd: ClothingItem = {
      ...product,
      price: selectedVariant?.price || product.price,
    };
    onAddToCart(productToAdd);
  };

  const currentPrice = selectedVariant?.price || product.price;
  const isInStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const canAddToCart = isInStock && quantity > 0;

  return (
    <section className="animate-fade-in">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 font-semibold">
            <ChevronLeftIcon className="w-5 h-5" />
            Back
        </button>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg overflow-hidden">
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover aspect-[3/4]"
                />
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-cyan-400 uppercase tracking-widest">{product.category}</span>
                <h2 className="font-orbitron text-3xl md:text-4xl font-bold my-2">{product.name}</h2>
                
                {/* Price Display */}
                <div className="flex items-center gap-4 mb-4">
                    <p className="font-orbitron text-3xl text-gray-300">${currentPrice.toFixed(2)}</p>
                    {product.comparePrice && product.comparePrice > currentPrice && (
                        <p className="font-orbitron text-xl text-gray-500 line-through">
                            ${product.comparePrice.toFixed(2)}
                        </p>
                    )}
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed">{product.description}</p>

                {/* Product Variants */}
                {variants.length > 0 && (
                    <div className="mb-6">
                        <ProductVariantSelector
                            variants={variants}
                            onVariantChange={handleVariantChange}
                        />
                    </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-md flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                        >
                            -
                        </button>
                        <span className="w-16 text-center text-white font-semibold">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-md flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                    {isInStock ? (
                        <p className="text-green-400 text-sm">
                            ✓ In Stock
                            {selectedVariant && selectedVariant.stock > 0 && (
                                <span className="ml-2">({selectedVariant.stock} available)</span>
                            )}
                        </p>
                    ) : (
                        <p className="text-red-400 text-sm">✗ Out of Stock</p>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className="font-orbitron text-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.5)] w-full md:w-auto"
                >
                    {!isInStock ? 'Out of Stock' : `Add to Cart - $${(currentPrice * quantity).toFixed(2)}`}
                </button>
            </div>
        </div>
    </section>
  );
};
