import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fashion Blogger',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'Fantastic shop! Great selection, fair prices, and friendly staff. Highly recommended. The quality of the products is exceptional, and the prices are very reasonable!',
      rating: 5,
      product: 'Contrasting sheepskin sweatshirt',
      productPrice: '$60.00',
      productImage: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Style Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'I absolutely love this shop! The products are high-quality and the customer service is excellent. I always leave with exactly what I need and a smile on my face.',
      rating: 5,
      product: 'Vintage denim jacket',
      productPrice: '$89.99',
      productImage: 'https://images.unsplash.com/photo-1544022613-e87ca75a784f?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Fashion Designer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'The attention to detail and quality is outstanding. Every piece I\'ve purchased has exceeded my expectations. This is my go-to store for all fashion needs.',
      rating: 5,
      product: 'Silk blouse',
      productPrice: '$75.00',
      productImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Business Professional',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Outstanding customer service and product quality. The shipping was fast and everything arrived perfectly packaged. Will definitely shop here again!',
      rating: 5,
      product: 'Wool blazer',
      productPrice: '$120.00',
      productImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  ];

  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto container-padding">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-heading-2 md:text-heading-1 text-primary mb-6">
            Customer Say!
          </h2>
          <p className="text-body-lg text-secondary max-w-3xl mx-auto">
            Our customers adore our products, and we constantly aim to delight them.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative mb-4">
                <img
                  src={testimonial.productImage}
                  alt={testimonial.product}
                  className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-gray-900">
                  {testimonial.productPrice}
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="mb-6">
                <p className="text-body-sm text-secondary leading-relaxed mb-4">
                  "{testimonial.content}"
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Product Name */}
                <p className="text-body-sm font-medium text-primary mb-2">
                  {testimonial.product}
                </p>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-light">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-primary text-body-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-muted text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300">
            Read More Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
