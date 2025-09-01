import React from 'react';
import type { ClothingItem } from '../types';
import { ChevronLeftIcon } from './icons';

interface ProductDetailPageProps {
  product: ClothingItem;
  onAddToCart: (item: ClothingItem) => void;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onAddToCart, onBack }) => {
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
                <p className="font-orbitron text-3xl text-gray-300 mb-4">${product.price.toFixed(2)}</p>
                <p className="text-gray-400 mb-8 leading-relaxed">{product.description}</p>
                <button
                    onClick={() => onAddToCart(product)}
                    className="font-orbitron text-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.5)] w-full md:w-auto"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    </section>
  );
};
