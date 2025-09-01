import React from 'react';
import type { ClothingItem } from '../types';
import { TrashIcon } from './icons';

interface CartPageProps {
  cartItems: ClothingItem[];
  onBack: () => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cartItems, onBack, onRemoveItem, onCheckout }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <section className="max-w-4xl mx-auto animate-fade-in">
      <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-8 text-shadow-glow">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center bg-gray-800/40 border border-gray-700 rounded-lg p-12">
          <p className="text-xl text-gray-400 mb-4">Your shopping cart is empty.</p>
          <button onClick={onBack} className="font-orbitron text-lg text-cyan-400 hover:text-cyan-300">
            &larr; Discover your style
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center bg-gray-800/40 border border-gray-700 rounded-lg p-4 gap-4">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-orbitron text-lg mb-2">${item.price.toFixed(2)}</p>
                  <button onClick={() => onRemoveItem(index)} className="text-gray-400 hover:text-red-400 transition-colors p-1" aria-label="Remove item">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6 sticky top-28">
              <h3 className="font-orbitron text-2xl font-bold mb-4">Order Summary</h3>
              <div className="flex justify-between text-lg mb-2">
                <span>Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">Shipping & taxes calculated at checkout.</p>
              <button
                onClick={onCheckout}
                className="font-orbitron text-lg w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
              >
                Proceed to Checkout
              </button>
              <button onClick={onBack} className="w-full text-center mt-4 text-cyan-400 hover:text-cyan-300">
                &larr; Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
