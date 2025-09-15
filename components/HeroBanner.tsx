import React from 'react';
import { ChevronRightIcon } from './icons';

interface HeroBannerProps {
  onExploreCollection: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreCollection }) => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Placeholder for hero image - you can replace with actual image */}
          <div className="w-full h-full bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20"></div>
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center container-padding max-w-6xl mx-auto">
        {/* Limited Edition Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium text-sm tracking-wide">LIMITED EDITION</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-display md:text-6xl lg:text-7xl text-white mb-8 leading-tight">
          Don't miss out on our{' '}
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            exclusive
          </span>{' '}
          limited edition pieces.
        </h1>

        {/* Subheading */}
        <p className="text-body-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
          Reserved for special occasions. Discover unique pieces that define your style and make every moment extraordinary.
        </p>

        {/* CTA Button */}
        <button
          onClick={onExploreCollection}
          className="group inline-flex items-center gap-3 bg-white text-black font-semibold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
        >
          Explore Collection
          <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        {/* Additional Info */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-body-sm text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
            <span>Free Shipping Worldwide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>14-Day Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-white/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-white/10 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
      <div className="absolute top-1/3 right-8 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-500"></div>
    </div>
  );
};

export default HeroBanner;
