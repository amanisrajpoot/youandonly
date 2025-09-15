import React from 'react';
import { TruckIcon, ArrowPathIcon, PhoneIcon, GiftIcon } from './icons';

const TrustSignals: React.FC = () => {
  const signals = [
    {
      icon: TruckIcon,
      title: 'Free Shipping',
      description: 'No extra costs, just the price you see.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: ArrowPathIcon,
      title: '14-Day Returns',
      description: 'Risk-free shopping with easy returns.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: PhoneIcon,
      title: '24/7 Support',
      description: '24/7 support, always here just for you.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: GiftIcon,
      title: 'Member Discounts',
      description: 'Special prices for our loyal customers.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="section-padding bg-primary">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals.map((signal, index) => {
            const IconComponent = signal.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${signal.bgColor} mb-6 group-hover:shadow-lg transition-shadow duration-300`}>
                  <IconComponent className={`w-8 h-8 ${signal.color}`} />
                </div>
                <h3 className="text-heading-4 text-primary mb-3">
                  {signal.title}
                </h3>
                <p className="text-body-sm text-secondary">
                  {signal.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
