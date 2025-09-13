import React, { useState, useCallback, useEffect } from 'react';
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
import { ProductCard } from './components/ProductCard';
import { OrderHistory } from './components/OrderHistory';
import { OrderDetails } from './components/OrderDetails';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import productService from './services/productService';


type View = 'home' | 'pdp' | 'cart' | 'catalog' | 'checkout' | 'orders' | 'order-details' | 'admin';

const App: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generatedOutfits, setGeneratedOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<View>('home');
  const [previousView, setPreviousView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<ClothingItem | null>(null);
  const [cart, setCart] = useState<ClothingItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<ClothingItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  // Load featured items on component mount
  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        setIsLoadingFeatured(true);
        const items = await productService.getFeaturedProducts();
        setFeaturedItems(items);
      } catch (error) {
        console.error('Failed to load featured items:', error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    loadFeaturedItems();
  }, []);

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
    setCart([]);
    setView('checkout');
  };

  const handleViewOrders = () => {
    setPreviousView(view);
    setView('orders');
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setPreviousView(view);
    setView('order-details');
  };

  const handleViewAdmin = () => {
    setPreviousView(view);
    setView('admin');
  };

  const handleNavigate = (targetView: 'home' | 'cart' | 'catalog') => {
    setView(targetView);
  }

  const renderHome = () => (
    <>
     <section className="text-center max-w-4xl mx-auto mb-24">
        <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-4 text-shadow-glow">
          Find a Style That's Uniquely You
        </h2>
        <p className="text-lg text-gray-300">
          Explore our curated collection or let our AI build the perfect outfit, just for you.
        </p>
      </section>

      <section className="mb-24">
        <h3 className="text-3xl font-orbitron font-bold text-center mb-8 text-shadow-glow">Featured Collection</h3>
        {isLoadingFeatured ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner className="w-8 h-8" />
            <span className="ml-3 text-gray-300">Loading featured items...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
                {featuredItems.map(item => (
                    <ProductCard key={item.id} product={item} onClick={() => handleProductClick(item)} />
                ))}
            </div>
            <div className="text-center mt-10">
                <button onClick={() => setView('catalog')} className="font-orbitron text-lg inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                    View Full Collection
                </button>
            </div>
          </>
        )}
    </section>

    <section className="text-center max-w-3xl mx-auto py-16 border-t border-cyan-500/20">
        <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-4 text-shadow-glow">
            Need Inspiration? Meet Your AI Stylist
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Select a fashion style below and let our AI craft unique outfits, just for you.
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
              className="font-orbitron text-lg inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
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

        {!isLoading && generatedOutfits.length === 0 && !error && selectedStyle && (
            <div className="text-center text-gray-500 mt-20">
            <p className="text-2xl font-orbitron">Your personal gallery awaits.</p>
          </div>
        )}
      </section>
    </>
  );

  const renderContent = () => {
    switch(view) {
      case 'catalog':
        return <CatalogPage onProductClick={handleProductClick} />;
      case 'pdp':
        return selectedProduct && <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} onBack={() => setView(previousView)} />;
      case 'cart':
        return <CartPage cartItems={cart} onBack={() => setView('home')} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />;
      case 'checkout':
        return <CheckoutPage 
          cartItems={cart} 
          onContinueShopping={() => {
            setCart([]);
            setView('home');
          }} 
          onBack={() => setView('cart')} 
        />;
      case 'orders':
        return <OrderHistory 
          onBack={() => setView(previousView)} 
          onViewOrder={handleViewOrderDetails}
        />;
      case 'order-details':
        return selectedOrder ? (
          <OrderDetails 
            order={selectedOrder} 
            onBack={() => setView(previousView)} 
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Order not found</p>
            <button onClick={() => setView('home')} className="text-cyan-400 hover:text-cyan-300 underline mt-4">
              Go Home
            </button>
          </div>
        );
      case 'admin':
        return <AdminDashboard onBack={() => setView(previousView)} />;
      case 'home':
      default:
        return renderHome();
    }
  }


  return (
    <AuthProvider>
      <div className="min-h-screen bg-black bg-opacity-80 backdrop-blur-sm text-gray-100">
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900/50 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,123,148,0.3),rgba(255,255,255,0))]"></div>
        <Header 
          onNavigate={handleNavigate} 
          onViewOrders={handleViewOrders}
          onViewAdmin={handleViewAdmin}
          cartItemCount={cart.length} 
        />
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;