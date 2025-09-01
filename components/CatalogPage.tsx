import React, { useState, useMemo } from 'react';
import type { ClothingItem } from '../types';
import { CLOTHING_CATALOG } from '../constants';
import { ProductCard } from './ProductCard';

interface CatalogPageProps {
  onProductClick: (item: ClothingItem) => void;
}

const categories = ['All', 'Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'];

export const CatalogPage: React.FC<CatalogPageProps> = ({ onProductClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return CLOTHING_CATALOG;
    }
    return CLOTHING_CATALOG.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4 text-shadow-glow">
          Explore The Collection
        </h2>
        <p className="text-lg text-gray-300">
          Browse our curated catalog of futuristic and classic pieces.
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`font-orbitron text-sm md:text-base px-5 py-2 rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === category
                ? 'bg-cyan-500 border-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {filteredItems.map(item => (
          <ProductCard key={item.id} product={item} onClick={() => onProductClick(item)} />
        ))}
      </div>
    </section>
  );
};
