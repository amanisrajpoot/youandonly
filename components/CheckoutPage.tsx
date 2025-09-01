import React from 'react';
import { CheckCircleIcon } from './icons';

interface CheckoutPageProps {
  onContinueShopping: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onContinueShopping }) => {
  return (
    <section className="max-w-2xl mx-auto text-center animate-fade-in py-16">
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-12 flex flex-col items-center">
        <CheckCircleIcon className="w-20 h-20 text-cyan-400 mb-6" />
        <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 text-shadow-glow">
          Thank You!
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Your order has been placed. A confirmation will be sent to your registered email.
        </p>
        <button
          onClick={onContinueShopping}
          className="font-orbitron text-lg inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
        >
          Continue Shopping
        </button>
      </div>
    </section>
  );
};
