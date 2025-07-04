import { useState } from 'react';
import CartIcon from './CartIcon';
import CartModal from './CartModal';
import Link from 'next/link';

export default function Navbar({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
      <div className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => window.location.href = '/'}>You&Only</div>
      <div className="flex-1 flex justify-end items-center gap-2">
        <Link href="/category/all/" className="text-gray-700 hover:text-rose-400 font-medium px-2 transition-colors">All</Link>
        <Link href="/category/men/" className="text-gray-700 hover:text-rose-400 font-medium px-2 transition-colors">Men</Link>
        <Link href="/category/women/" className="text-gray-700 hover:text-rose-400 font-medium px-2 transition-colors">Women</Link>
        <Link href="/category/kids/" className="text-gray-700 hover:text-rose-400 font-medium px-2 transition-colors">Kids</Link>
        {children}
        <CartIcon onClick={() => setCartOpen(true)} />
        <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </nav>
  );
} 