import React from 'react';
import { ChevronRightIcon } from './icons';

interface CategoryTilesProps {
  onNavigate: (view: 'catalog') => void;
}

const CategoryTiles: React.FC<CategoryTilesProps> = ({ onNavigate }) => {
  const categories = [
    {
      id: 'womens',
      title: "Discover Women's",
      subtitle: "Browse our Top Trending: the hottest picks loved by all.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=faces",
      bgGradient: "from-pink-500 to-purple-600",
      textColor: "text-white",
      buttonColor: "bg-white text-pink-600 hover:bg-gray-100"
    },
    {
      id: 'mens',
      title: "Discover Men's",
      subtitle: "Browse our Top Trending: the hottest picks loved by all.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=faces",
      bgGradient: "from-blue-500 to-indigo-600",
      textColor: "text-white",
      buttonColor: "bg-white text-blue-600 hover:bg-gray-100"
    },
    {
      id: 'accessories',
      title: "Accessories",
      subtitle: "Complete your look with our curated selection.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&crop=faces",
      bgGradient: "from-amber-500 to-orange-600",
      textColor: "text-white",
      buttonColor: "bg-white text-amber-600 hover:bg-gray-100"
    }
  ];

  return (
    <section className="section-padding bg-primary">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Background Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-80`}></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                  <h3 className={`text-heading-2 md:text-heading-1 font-bold ${category.textColor} mb-4`}>
                    {category.title}
                  </h3>
                  <p className={`text-body-lg ${category.textColor} mb-8 max-w-sm`}>
                    {category.subtitle}
                  </p>
                  <button
                    onClick={() => onNavigate('catalog')}
                    className={`group/btn inline-flex items-center gap-2 ${category.buttonColor} font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg`}
                  >
                    Shop Now
                    <ChevronRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryTiles;
