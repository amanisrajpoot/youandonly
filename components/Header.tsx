import React, { useState } from 'react';
import { UserIcon, CartIcon, MagnifyingGlassIcon, HeartIcon, ArrowsRightLeftIcon, Bars3Icon, XMarkIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';
import { SearchAutocomplete } from './SearchAutocomplete';

interface HeaderProps {
  onNavigate: (view: 'home' | 'cart' | 'catalog' | 'wishlist' | 'compare') => void;
  onViewOrders: () => void;
  onViewAdmin: () => void;
  onProductClick: (product: any) => void;
  cartItemCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onViewOrders, onViewAdmin, onProductClick, cartItemCount }) => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUserClick = () => {
    if (user) {
      // User is logged in - could show profile dropdown in future
      console.log('User profile clicked');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
    { name: 'Home', onClick: () => onNavigate('home') },
    { name: 'Shop', onClick: () => onNavigate('catalog') },
    { name: 'Pages', onClick: () => console.log('Pages clicked') },
    { name: 'Blog', onClick: () => console.log('Blog clicked') },
    { name: 'Contact', onClick: () => console.log('Contact clicked') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-light shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto container-padding flex justify-between items-center text-body-sm">
          <div className="flex items-center gap-4">
            <span>Free shipping on orders over $100</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">New arrivals every week</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Need help? Call us: (315) 666-6688</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto container-padding py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="text-left group">
            <h1 className="text-heading-2 md:text-heading-1 text-primary group-hover:text-secondary transition-colors font-bold uppercase tracking-wider">
              You & Only
            </h1>
            <p className="text-body-sm text-muted hidden md:block">Modern Retreat</p>
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchAutocomplete
              onSearch={(query) => {
                setSearchQuery(query);
                onNavigate('catalog');
              }}
              onProductClick={onProductClick}
              placeholder="Search for products..."
              className="w-full"
            />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon (Mobile) */}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden text-secondary hover:text-primary transition-colors p-2"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => onNavigate('wishlist')}
              className="text-secondary hover:text-primary transition-colors p-2 relative"
            >
              <HeartIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-xs font-bold text-white">
                0
              </span>
            </button>

            {/* Compare */}
            <button 
              onClick={() => onNavigate('compare')}
              className="text-secondary hover:text-primary transition-colors p-2 relative"
            >
              <ArrowsRightLeftIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-xs font-bold text-white">
                0
              </span>
            </button>

            {/* Account */}
            <button 
              onClick={handleUserClick}
              className="text-secondary hover:text-primary transition-colors p-2"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button 
              onClick={() => onNavigate('cart')} 
              className="relative text-secondary hover:text-primary transition-colors p-2"
            >
              <CartIcon className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-secondary hover:text-primary transition-colors p-2"
            >
              {showMobileMenu ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8 mt-4">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className="text-secondary hover:text-primary transition-colors font-medium uppercase tracking-wide text-body-sm"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden mt-4">
            <SearchAutocomplete
              onSearch={(query) => {
                setSearchQuery(query);
                onNavigate('catalog');
                setShowSearch(false);
              }}
              onProductClick={onProductClick}
              placeholder="Search for products..."
              className="w-full"
            />
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 py-4 border-t border-light">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.onClick();
                    setShowMobileMenu(false);
                  }}
                  className="text-secondary hover:text-primary transition-colors font-medium uppercase tracking-wide text-body-sm text-left"
                >
                  {item.name}
                </button>
              ))}
              {user ? (
                <div className="pt-4 border-t border-light">
                  <button
                    onClick={onViewOrders}
                    className="text-secondary hover:text-primary transition-colors text-body-sm font-medium block mb-2"
                  >
                    Orders
                  </button>
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={onViewAdmin}
                      className="text-accent hover:text-accent-hover transition-colors text-body-sm font-medium block mb-2"
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-secondary hover:text-primary transition-colors text-body-sm font-medium block"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-light">
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="text-secondary hover:text-primary transition-colors text-body-sm font-medium block mb-2"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowRegisterModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="text-accent hover:text-accent-hover transition-colors text-body-sm font-medium block"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </header>
  );
};