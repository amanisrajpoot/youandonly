import React, { useState, useEffect } from 'react';
import type { ProductVariant } from '../types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | null) => void;
  className?: string;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  onVariantChange,
  className = ""
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Group variants by attribute type
  const attributeGroups = React.useMemo(() => {
    const groups: Record<string, string[]> = {};
    
    variants.forEach(variant => {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        if (!groups[key]) {
          groups[key] = [];
        }
        if (!groups[key].includes(value)) {
          groups[key].push(value);
        }
      });
    });

    return groups;
  }, [variants]);

  // Find variant based on selected attributes
  useEffect(() => {
    const matchingVariant = variants.find(variant => {
      return Object.entries(selectedAttributes).every(([key, value]) => 
        variant.attributes[key] === value
      );
    });

    setSelectedVariant(matchingVariant || null);
    onVariantChange(matchingVariant || null);
  }, [selectedAttributes, variants, onVariantChange]);

  const handleAttributeChange = (attribute: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  if (variants.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {Object.entries(attributeGroups).map(([attribute, values]) => (
        <div key={attribute}>
          <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
            {attribute}
          </label>
          <div className="flex flex-wrap gap-2">
            {values.map(value => (
              <button
                key={value}
                onClick={() => handleAttributeChange(attribute, value)}
                className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                  selectedAttributes[attribute] === value
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedVariant && (
        <div className="mt-4 p-4 bg-gray-800/40 border border-gray-700 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Selected Variant</p>
              <p className="font-semibold text-white">{selectedVariant.name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-cyan-400">
                ${selectedVariant.price.toFixed(2)}
              </p>
              <p className={`text-sm ${
                selectedVariant.stock > 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {selectedVariant.stock > 0 
                  ? `${selectedVariant.stock} in stock` 
                  : 'Out of stock'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
