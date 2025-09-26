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
import { EnhancedShopPage } from './components/EnhancedShopPage';
import { CheckoutPage } from './components/CheckoutPage';
import { ProductCard } from './components/ProductCard';
import { OrderHistory } from './components/OrderHistory';
import { OrderDetails } from './components/OrderDetails';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import productService from './services/productService';
import HeroBanner from './components/HeroBanner';
import PromotionalSection from './components/PromotionalSection';
import ModernProductGrid from './components/ModernProductGrid';
import TrustSignals from './components/TrustSignals';
import TestimonialsSection from './components/TestimonialsSection';
import ModernFooter from './components/ModernFooter';
import CategoryTiles from './components/CategoryTiles';
import ProductCarousel from './components/ProductCarousel';
import NewsletterSignup from './components/NewsletterSignup';
import Breadcrumb from './components/Breadcrumb';
import { QuickViewModal } from './components/QuickViewModal';
import { WishlistPage } from './components/WishlistPage';
import { ComparePage } from './components/ComparePage';


type View = 'home' | 'pdp' | 'cart' | 'catalog' | 'checkout' | 'orders' | 'order-details' | 'admin' | 'wishlist' | 'compare';

const App: React.FC = () => {
  console.log('🚀 App component rendering...');
  
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
  const [quickViewProduct, setQuickViewProduct] = useState<ClothingItem | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Load featured items on component mount
  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        console.log('🔄 Loading featured items...');
        setIsLoadingFeatured(true);
        const items = await productService.getFeaturedProducts();
        console.log('✅ Featured items loaded:', items);
        setFeaturedItems(items);
      } catch (error) {
        console.error('❌ Failed to load featured items:', error);
        // Fallback to local data
        const fallbackItems = [
          { id: 21, name: "Leather Biker Jacket", category: "Outerwear", imageUrl: "https://picsum.photos/seed/bikerjacket/400/600", price: 299.99, description: "An iconic biker jacket crafted from supple genuine leather." },
          { id: 7, name: "Cargo Pants", category: "Bottom", imageUrl: "https://picsum.photos/seed/cargopants/400/600", price: 99.99, description: "Utilitarian cargo pants crafted from durable ripstop cotton." },
          { id: 12, name: "Chunky Black Boots", category: "Shoes", imageUrl: "https://picsum.photos/seed/blackboots/400/600", price: 179.99, description: "Bold combat-style boots with a chunky lug sole." },
          { id: 19, name: "Round Sunglasses", category: "Accessory", imageUrl: "https://picsum.photos/seed/sunglasses/400/600", price: 69.99, description: "Vintage-style round sunglasses with UV protection." }
        ];
        console.log('🔄 Using fallback items:', fallbackItems);
        setFeaturedItems(fallbackItems);
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

  const handleAddToCart = (item: ClothingItem, quantity: number = 1) => {
    // Add multiple items if quantity > 1
    const itemsToAdd = Array(quantity).fill(item);
    setCart(prevCart => [...prevCart, ...itemsToAdd]);
    setView('cart');
  };

  const handleQuickView = (item: ClothingItem) => {
    setQuickViewProduct(item);
    setShowQuickView(true);
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
    setQuickViewProduct(null);
  };

  const handleAddToWishlist = (item: ClothingItem) => {
    // TODO: Implement wishlist functionality
    console.log('Added to wishlist:', item);
  };

  const handleAddToCompare = (item: ClothingItem) => {
    // TODO: Implement compare functionality
    console.log('Added to compare:', item);
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

  const handleNavigate = (targetView: 'home' | 'cart' | 'catalog' | 'wishlist' | 'compare') => {
    setView(targetView);
  }

  const renderHome = () => {
    console.log('🏠 renderHome called, isLoadingFeatured:', isLoadingFeatured, 'featuredItems:', featuredItems.length);
    
    if (isLoadingFeatured) {
      console.log('⏳ Showing loading state...');
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-body-lg text-secondary">Loading featured products...</p>
          </div>
        </div>
      );
    }

    console.log('✅ Rendering home page with', featuredItems.length, 'featured items');

    return (
      <>
        {/* Hero Banner */}
        <HeroBanner onExploreCollection={() => setView('catalog')} />

        {/* Category Highlight Tiles */}
        <CategoryTiles onNavigate={setView} />

        {/* Trust Signals */}
        <TrustSignals />

        {/* Featured Products Carousel */}
        <ProductCarousel
          products={featuredItems}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
          title="Shop our top picks"
          subtitle="Reserved for special occasions"
        />

        {/* Promotional Section */}
        <PromotionalSection onShopNow={() => setView('catalog')} />

        {/* New Arrivals Carousel */}
        <ProductCarousel
          products={featuredItems.slice(0, 6)}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
          title="New Arrivals"
          subtitle="Discover the latest fashion trends"
        />

      {/* AI Stylist Section */}
      <section className="section-padding bg-primary">
        <div className="container mx-auto container-padding text-center">
          <h2 className="text-heading-2 md:text-heading-1 text-primary mb-8">
            Need Inspiration? Meet Your AI Stylist
          </h2>
          <p className="text-body-lg text-secondary mb-16 max-w-4xl mx-auto">
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
                className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/30"
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

          {error && <p className="text-center text-error text-lg mt-8">{error}</p>}
          
          {generatedOutfits.length > 0 && (
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {generatedOutfits.map((outfit, index) => (
                <OutfitCard key={index} outfit={outfit} onProductClick={handleProductClick} />
              ))}
            </div>
          )}

          {!isLoading && generatedOutfits.length === 0 && !error && selectedStyle && (
            <div className="text-center text-muted mt-20">
              <p className="text-heading-4">Your personal gallery awaits.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter Signup */}
      <NewsletterSignup />
      </>
    );
  };

  const renderContent = () => {
    switch(view) {
      case 'catalog':
        return (
          <EnhancedShopPage
            onProductClick={handleProductClick}
            onQuickView={handleQuickView}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onAddToCompare={handleAddToCompare}
          />
        );
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
      case 'wishlist':
        return <WishlistPage onProductClick={handleProductClick} onAddToCart={handleAddToCart} onBack={() => setView('home')} />;
      case 'compare':
        return <ComparePage onProductClick={handleProductClick} onAddToCart={handleAddToCart} onBack={() => setView('home')} />;
      case 'home':
      default:
        return renderHome();
    }
  }


  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header 
          onNavigate={handleNavigate} 
          onViewOrders={handleViewOrders}
          onViewAdmin={handleViewAdmin}
          onProductClick={handleProductClick}
          cartItemCount={cart.length} 
        />
        <main>
        {renderContent()}
      </main>
        <ModernFooter />
        
        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={showQuickView}
          onClose={handleCloseQuickView}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onAddToCompare={handleAddToCompare}
        />
    </div>
    </AuthProvider>
  );
};

export default App;