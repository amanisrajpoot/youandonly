import React, { useState } from 'react';
import { EnvelopeIcon } from './icons';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="section-padding bg-accent">
        <div className="container mx-auto container-padding text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
              <EnvelopeIcon className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-heading-2 text-white mb-4">
              Thank You for Subscribing!
            </h2>
            <p className="text-body-lg text-white/90">
              You'll receive 10% OFF your next order, exclusive offers & more!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-accent">
      <div className="container mx-auto container-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-heading-2 md:text-heading-1 text-white mb-6">
            Subscribe To Our Newsletter!
          </h2>
          <p className="text-body-lg text-white/90 mb-12 max-w-2xl mx-auto">
            Receive 10% OFF your next order, exclusive offers & more!
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 rounded-full border-0 focus:outline-none focus:ring-4 focus:ring-white/30 text-primary placeholder-muted"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="bg-white text-accent font-bold py-4 px-8 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-body-sm">No spam, ever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-body-sm">Unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-body-sm">Exclusive offers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
