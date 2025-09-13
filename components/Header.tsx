import React, { useState } from 'react';
import { UserIcon, CartIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

interface HeaderProps {
  onNavigate: (view: 'home' | 'cart' | 'catalog') => void;
  onViewOrders: () => void;
  onViewAdmin: () => void;
  cartItemCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onViewOrders, onViewAdmin, cartItemCount }) => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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

  return (
    <header className="py-4 border-b border-cyan-500/20 sticky top-0 bg-gray-900/50 backdrop-blur-lg z-10">
      <div className="container mx-auto flex justify-between items-center px-4">
        <button onClick={() => onNavigate('home')} className="text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider uppercase font-orbitron text-shadow-glow">
            You & Only
          </h1>
          <p className="text-cyan-400 text-sm hidden md:block">Your Personal Stylist</p>
        </button>

        <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className="text-gray-300 hover:text-cyan-400 transition-colors font-semibold uppercase tracking-wider">AI Stylist</button>
            <button onClick={() => onNavigate('catalog')} className="text-gray-300 hover:text-cyan-400 transition-colors font-semibold uppercase tracking-wider">Shop</button>
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 hidden md:block">
                        Welcome, {user.firstName}
                      </span>
                      <button
                        onClick={onViewOrders}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        Orders
                      </button>
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={onViewAdmin}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                        >
                          Admin
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Login
              </button>
              <span className="text-gray-500">|</span>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              >
                Register
              </button>
            </div>
          )}
          <button onClick={() => onNavigate('cart')} className="relative text-gray-300 hover:text-white transition-colors">
            <CartIcon className="w-7 h-7" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white shadow-[0_0_10px_rgba(34,211,238,0.7)]">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
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