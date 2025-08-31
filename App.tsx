
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StyleSelector } from './components/StyleSelector';
import { OutfitCard } from './components/OutfitCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FASHION_STYLES } from './constants';
import type { Outfit, ClothingItem } from './types';
import { generateOutfits } from './services/geminiService';
import { SparklesIcon } from './components/icons';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CatalogPage } from './components/CatalogPage';
import { CheckoutPage } from './components/CheckoutPage';


type View = 'home' | 'pdp' | 'cart' | 'catalog' | 'checkout';

const App: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generatedOutfits, setGeneratedOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<View>('home');
  const [previousView, setPreviousView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<ClothingItem | null>(null);
  const [cart, setCart] = useState<ClothingItem[]>([]);


  const handleGenerateClick = useCallback(async () => {
    if (!selectedStyle) {
      setError("Please select a style first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedOutfits([]);

    try {
      const outfits = await generateOutfits(selectedStyle);
      setGeneratedOutfits(outfits);
    } catch (err) {
      console.error(err);
      setError("Failed to generate outfits. The AI might be busy, please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStyle]);

  const handleProductClick = (item: ClothingItem) => {
    setSelectedProduct(item);
    setPreviousView(view);
    setView('pdp');
  }

  const handleAddToCart = (item: ClothingItem) => {
    setCart(prevCart => [...prevCart, item]);
    setView('cart');
  };
  
  const handleRemoveFromCart = (indexToRemove: number) => {
    setCart(prevCart => prevCart.filter((_, index) => index !== indexToRemove));
  };

  const handleCheckout = () => {
    // In a real app, this would process payment, etc.
    // For this demo, we'll just clear the cart and show a confirmation.
    setCart([]);
    setView('checkout');
  };

  const handleNavigate = (targetView: 'home' | 'cart' | 'catalog') => {
    setView(targetView);
  }

  const renderHome = () => (
    <>
     <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4 text-shadow-glow">
          Discover Your Signature Look
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Select a fashion style below and let our AI stylist, AURA, craft unique outfits just for you.
        </p>
        <StyleSelector
          styles={FASHION_STYLES}
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
        />
        {selectedStyle && (
          <div className="mt-8">
            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="font-orbitron text-lg inline-flex items-center gap-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-fuchsia-800 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-fuchsia-400 focus:ring-opacity-50 shadow-[0_0_20px_rgba(217,70,239,0.5)]"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="w-6 h-6" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-6 h-6" />
                  Generate Outfits
                </>
              )}
            </button>
          </div>
        )}
      </section>

      <section className="mt-16">
        {error && <p className="text-center text-red-400 text-lg">{error}</p>}
        
        {generatedOutfits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {generatedOutfits.map((outfit, index) => (
              <OutfitCard key={index} outfit={outfit} onProductClick={handleProductClick} />
            ))}
          </div>
        )}

        {!isLoading && generatedOutfits.length === 0 && !error && (
            <div className="text-center text-gray-500 mt-20">
            <p className="text-2xl font-orbitron">Your AI-curated gallery awaits.</p>
            <p>Select a style and press generate to begin.</p>
          </div>
        )}
      </section>
    </>
  )

  const renderContent = () => {
    switch(view) {
      case 'catalog':
        return <CatalogPage onProductClick={handleProductClick} />;
      case 'pdp':
        return selectedProduct && <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} onBack={() => setView(previousView)} />;
      case 'cart':
        return <CartPage cartItems={cart} onBack={() => setView('home')} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />;
      case 'checkout':
        return <CheckoutPage onContinueShopping={() => setView('home')} />;
      case 'home':
      default:
        return renderHome();
    }
  }


  return (
    <div className="min-h-screen bg-black bg-opacity-80 backdrop-blur-sm text-gray-100">
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/50 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <Header onNavigate={handleNavigate} cartItemCount={cart.length} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
