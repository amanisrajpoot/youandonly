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
      <h2 className="text-heading-2 md:text-heading-1 text-primary mb-8">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center bg-secondary border border-light rounded-2xl p-12">
          <p className="text-heading-4 text-secondary mb-4">Your shopping cart is empty.</p>
          <button onClick={onBack} className="text-accent hover:text-accent-hover text-body-lg transition-colors">
            &larr; Discover your style
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center bg-white border border-light rounded-2xl p-6 gap-4 shadow-md hover:shadow-lg transition-shadow">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-grow">
                  <h3 className="text-heading-4 text-primary font-semibold">{item.name}</h3>
                  <p className="text-body-sm text-muted">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-heading-4 text-primary font-bold mb-2">${item.price.toFixed(2)}</p>
                  <button onClick={() => onRemoveItem(index)} className="text-muted hover:text-error transition-colors p-1" aria-label="Remove item">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white border border-light rounded-2xl p-6 sticky top-28 shadow-md">
              <h3 className="text-heading-3 text-primary font-bold mb-4">Order Summary</h3>
              <div className="flex justify-between text-body-lg mb-2">
                <span className="text-secondary">Subtotal</span>
                <span className="font-bold text-primary">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-body-sm text-muted mb-6">Shipping & taxes calculated at checkout.</p>
              <button
                onClick={onCheckout}
                className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/30"
              >
                Proceed to Checkout
              </button>
              <button onClick={onBack} className="w-full text-center mt-4 text-accent hover:text-accent-hover transition-colors">
                &larr; Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
