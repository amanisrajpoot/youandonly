import React from 'react';
import type { ClothingItem } from '../types';

interface ProductCardProps {
  product: ClothingItem;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left bg-gray-800/40 border border-gray-700 rounded-lg overflow-hidden shadow-lg shadow-cyan-900/10 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/20 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
    >
      <div className="relative aspect-[3/4] group">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-cyan-400 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-white truncate mt-1">{product.name}</h3>
        <p className="font-orbitron text-lg text-gray-300 mt-2">${product.price.toFixed(2)}</p>
      </div>
    </button>
  );
};
