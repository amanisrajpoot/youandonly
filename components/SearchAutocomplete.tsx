import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from './icons';
import type { ClothingItem } from '../types';
import productService from '../services/productService';

interface SearchAutocompleteProps {
  onSearch: (query: string) => void;
  onProductClick: (product: ClothingItem) => void;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'recent';
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  query: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSearch,
  onProductClick,
  placeholder = "Search products, categories, or tags...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Search for suggestions
  const searchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      // Search products
      const products = await productService.searchProducts({ search: searchQuery });
      
      const productSuggestions: SearchSuggestion[] = products.slice(0, 5).map(product => ({
        type: 'product',
        id: product.id.toString(),
        title: product.name,
        subtitle: product.category,
        image: product.image,
        query: searchQuery
      }));

      // Add category suggestions
      const categorySuggestions: SearchSuggestion[] = [
        { type: 'category', id: 'women', title: 'Women\'s Clothing', query: 'women' },
        { type: 'category', id: 'men', title: 'Men\'s Clothing', query: 'men' },
        { type: 'category', id: 'accessories', title: 'Accessories', query: 'accessories' },
        { type: 'category', id: 'shoes', title: 'Shoes', query: 'shoes' }
      ].filter(cat => 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.query.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Add recent searches
      const recentSuggestions: SearchSuggestion[] = recentSearches
        .filter(recent => recent.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)
        .map(recent => ({
          type: 'recent',
          id: `recent-${recent}`,
          title: recent,
          query: recent
        }));

      const allSuggestions = [
        ...productSuggestions,
        ...categorySuggestions,
        ...recentSuggestions
      ].slice(0, 8);

      setSuggestions(allSuggestions);
      setIsOpen(allSuggestions.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSuggestions(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.query);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (suggestion.type === 'product') {
      // Find the product and trigger click
      const product = suggestions.find(s => s.id === suggestion.id);
      if (product) {
        // This would need to be passed down from parent
        console.log('Product clicked:', product);
      }
    } else {
      onSearch(suggestion.query);
      saveRecentSearch(suggestion.query);
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      saveRecentSearch(query);
      setIsOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          onSearch(query);
          saveRecentSearch(query);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-10 pr-10 border border-light rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-primary placeholder-muted"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-light rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-secondary">
              <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 ${
                    index === selectedIndex ? 'bg-secondary' : ''
                  }`}
                >
                  {suggestion.image && (
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-body text-primary truncate">
                      {suggestion.title}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-body-sm text-muted truncate">
                        {suggestion.subtitle}
                      </div>
                    )}
                  </div>
                  <div className="text-body-sm text-muted capitalize">
                    {suggestion.type}
                  </div>
                </button>
              ))}
            </div>
          ) : query && (
            <div className="p-4 text-center text-muted">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
