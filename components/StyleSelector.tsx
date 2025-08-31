
import React from 'react';

interface StyleSelectorProps {
  styles: string[];
  selectedStyle: string | null;
  onSelectStyle: (style: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelectStyle }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {styles.map(style => (
        <button
          key={style}
          onClick={() => onSelectStyle(style)}
          className={`font-orbitron text-sm md:text-base px-5 py-2 rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
            selectedStyle === style
              ? 'bg-fuchsia-500 border-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]'
              : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-fuchsia-500 hover:text-white'
          }`}
        >
          {style}
        </button>
      ))}
    </div>
  );
};
