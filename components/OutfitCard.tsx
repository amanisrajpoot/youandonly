
import React from 'react';
import type { Outfit, ClothingItem } from '../types';

interface OutfitCardProps {
  outfit: Outfit;
  onProductClick: (item: ClothingItem) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onProductClick }) => {
  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg overflow-hidden shadow-lg shadow-fuchsia-900/10 backdrop-blur-md transition-all duration-300 hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/20 transform hover:-translate-y-1">
      <div className="p-5">
        <h3 className="font-orbitron text-xl font-bold text-fuchsia-400 truncate">{outfit.outfitName}</h3>
        <p className="text-gray-300 mt-2 mb-4 text-sm h-10">{outfit.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-gray-700">
        {outfit.items.slice(0, 4).map(item => (
          <button 
            key={item.id} 
            onClick={() => onProductClick(item)}
            className="relative aspect-square group overflow-hidden focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-inset"
          >
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-2 bg-black/70 backdrop-blur-sm">
              <p className="text-xs text-white font-semibold truncate">{item.name}</p>
              <p className="text-xs text-fuchsia-300">{item.category}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
