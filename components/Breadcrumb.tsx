import React from 'react';
import { ChevronRightIcon, HomeIcon } from './icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (view: 'home' | 'cart' | 'catalog') => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      // Handle external links if needed
      window.open(item.href, '_blank');
    }
  };

  return (
    <nav className="bg-secondary py-4">
      <div className="container mx-auto container-padding">
        <ol className="flex items-center space-x-2 text-body-sm">
          <li>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-secondary hover:text-primary transition-colors duration-200"
            >
              <HomeIcon className="w-4 h-4 mr-1" />
              Home
            </button>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 text-muted mx-2" />
              {index === items.length - 1 ? (
                <span className="text-primary font-medium">{item.label}</span>
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  className="text-secondary hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
