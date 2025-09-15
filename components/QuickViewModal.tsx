import React, { useState, useEffect } from 'react';
import { XMarkIcon, HeartIcon, ArrowsRightLeftIcon, ShoppingCartIcon, MinusIcon, PlusIcon } from './icons';
import type { ClothingItem } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface QuickViewModalProps {
  product: ClothingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ClothingItem, quantity: number) => void;
  onAddToWishlist: (product: ClothingItem) => void;
  onAddToCompare: (product: ClothingItem) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && product) {
      setSelectedImage(0);
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
      setIsWishlisted(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart(product, quantity);
      // Close modal after adding to cart
      onClose();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist(product);
  };

  const handleCompare = () => {
    onAddToCompare(product);
  };

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  // Mock product images (in real app, this would come from product data)
  const productImages = [
    product.image,
    product.image, // In real app, these would be different angles
    product.image,
    product.image
  ];

  // Mock sizes and colors (in real app, these would come from product variants)
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];
  const availableColors = [
    { name: 'Black', value: 'black', class: 'bg-black' },
    { name: 'White', value: 'white', class: 'bg-white border border-gray-300' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-light">
          <h2 className="text-heading-3 text-primary">Quick View</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-primary transition-colors p-2"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)] overflow-hidden">
          {/* Product Images */}
          <div className="lg:w-1/2 p-6">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-accent' : 'border-light'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Product Title & Price */}
              <div>
                <h3 className="text-heading-2 text-primary mb-2">{product.name}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-muted line-through">
                        ${product.comparePrice!.toFixed(2)}
                      </span>
                      <span className="bg-error text-white px-2 py-1 rounded-full text-sm font-bold">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-body text-secondary">{product.description}</p>
              </div>

              {/* Size Selection */}
              <div>
                <h4 className="text-heading-4 text-primary mb-3">Size</h4>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedSize === size
                          ? 'border-accent bg-accent text-white'
                          : 'border-light hover:border-accent text-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h4 className="text-heading-4 text-primary mb-3">Color</h4>
                <div className="flex gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.value
                          ? 'border-accent scale-110'
                          : 'border-light hover:scale-105'
                      } ${color.class}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <h4 className="text-heading-4 text-primary mb-3">Quantity</h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-light flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="text-heading-4 text-primary min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-light flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedSize || !selectedColor}
                  className="w-full bg-accent hover:bg-accent-hover disabled:bg-muted disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/30 flex items-center justify-center gap-2"
                >
                  {isAddingToCart ? (
                    <>
                      <LoadingSpinner className="w-5 h-5" />
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex-1 py-3 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                      isWishlisted
                        ? 'border-error bg-error text-white'
                        : 'border-light hover:border-error text-primary'
                    }`}
                  >
                    <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>

                  <button
                    onClick={handleCompare}
                    className="flex-1 py-3 px-4 rounded-lg border border-light hover:border-accent text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowsRightLeftIcon className="w-5 h-5" />
                    Compare
                  </button>
                </div>
              </div>

              {/* Product Features */}
              <div className="pt-6 border-t border-light">
                <h4 className="text-heading-4 text-primary mb-3">Features</h4>
                <ul className="space-y-2 text-body-sm text-secondary">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Free shipping on orders over $100
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    14-day return policy
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Handcrafted with care
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
