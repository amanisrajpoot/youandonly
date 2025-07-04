import { useState } from 'react';
import CartIcon from './CartIcon';
import CartModal from './CartModal';

export default function Navbar({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white shadow-sm sticky top-0 z-20 border-b">
      <div className="text-2xl font-bold text-cyan-700 cursor-pointer" onClick={() => window.location.href = '/'}>You&Only</div>
      <div className="flex-1 flex justify-end items-center gap-2">
        {children}
        <CartIcon onClick={() => setCartOpen(true)} />
        <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </nav>
  );
} 