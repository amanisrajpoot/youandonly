import React from 'react';
import { HomeIcon } from './icons';

interface ShopHeroBannerProps {
  title: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  backgroundImage?: string;
}

export const ShopHeroBanner: React.FC<ShopHeroBannerProps> = ({
  title,
  breadcrumbs,
  backgroundImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&crop=faces"
}) => {
  return (
    <div className="relative bg-gray-100 min-h-[300px] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto container-padding">
        <div className="max-w-2xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-body-sm text-gray-600 mb-4">
            <HomeIcon className="w-4 h-4" />
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600 hover:text-primary transition-colors">
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>

          {/* Title */}
          <h1 className="text-heading-1 text-primary font-bold mb-4">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-body-lg text-gray-600 max-w-lg">
            Discover our curated collection of premium fashion items. 
            From timeless classics to contemporary trends, find your perfect style.
          </p>
        </div>
      </div>
    </div>
  );
};
