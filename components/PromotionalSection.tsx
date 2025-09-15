import React from 'react';
import { ChevronRightIcon } from './icons';

interface PromotionalSectionProps {
  onShopNow: () => void;
}

const PromotionalSection: React.FC<PromotionalSectionProps> = ({ onShopNow }) => {
  return (
    <div className="section-padding bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container mx-auto container-padding relative z-10">
        <div className="text-center">
          {/* Super Sale Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8">
            <span className="text-white font-bold text-lg">🔥</span>
            <span className="text-white font-bold text-lg">SUPER SALE</span>
            <span className="text-yellow-300 font-bold text-xl">UP TO 50%</span>
          </div>

          {/* Main Content */}
          <h2 className="text-heading-1 md:text-6xl text-white mb-8">
            Reserved for{' '}
            <span className="bg-white/20 px-6 py-3 rounded-xl">
              special occasions
            </span>
          </h2>

          <p className="text-body-lg text-white/90 mb-12 max-w-3xl mx-auto">
            Discover our curated collection of premium fashion pieces. Limited time offer with massive savings on selected items.
          </p>

          {/* CTA Button */}
          <button
            onClick={onShopNow}
            className="group inline-flex items-center gap-3 bg-white text-purple-600 font-bold px-12 py-4 rounded-full text-xl transition-all duration-300 hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
          >
            Shop Now
            <ChevronRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          {/* Urgency Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-body-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Limited Time Only</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="font-medium">While Supplies Last</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Free Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/20 rounded-full animate-spin-slow-reverse"></div>
    </div>
  );
};

export default PromotionalSection;
