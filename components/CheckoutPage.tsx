import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ChevronLeftIcon } from './icons';
import { StripeProvider } from './StripeProvider';
import { PaymentForm } from './PaymentForm';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';
import type { ClothingItem } from '../types';

interface CheckoutPageProps {
  cartItems: ClothingItem[];
  onContinueShopping: () => void;
  onBack: () => void;
}

type CheckoutStep = 'review' | 'payment' | 'success';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  cartItems, 
  onContinueShopping, 
  onBack 
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('review');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const handleCreateOrder = async () => {
    if (!user) {
      setError('Please log in to continue');
      return;
    }

    setIsCreatingOrder(true);
    setError(null);

    try {
      // Create order via API
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id.toString(),
          quantity: 1,
        })),
        notes: 'Order created from checkout',
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create order');
      }

      setOrderId(result.data.order.id);
      setCurrentStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);
    setCurrentStep('success');
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  const renderReviewStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Cart
        </button>
      </div>

      <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-8 text-shadow-glow text-center">
        Review Your Order
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-300 mb-4">Order Items</h3>
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center bg-gray-800/40 border border-gray-700 rounded-lg p-4 gap-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div className="flex-grow">
                <h4 className="font-semibold text-white">{item.name}</h4>
                <p className="text-sm text-gray-400">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-cyan-400">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-300 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Tax (8%)</span>
              <span className="text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Shipping</span>
              <span className="text-white">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-gray-600 pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-white">Total</span>
                <span className="text-cyan-400">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={isCreatingOrder}
            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center"
          >
            {isCreatingOrder ? (
              <>
                <LoadingSpinner className="w-5 h-5 mr-2" />
                Creating Order...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentStep('review')}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Review
        </button>
      </div>

      <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-8 text-shadow-glow text-center">
        Payment
      </h2>

      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-8">
        <StripeProvider>
          <PaymentForm
            amount={total}
            orderId={orderId!}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </StripeProvider>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-2xl mx-auto text-center animate-fade-in py-16">
      <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-12 flex flex-col items-center">
        <CheckCircleIcon className="w-20 h-20 text-cyan-400 mb-6" />
        <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4 text-shadow-glow">
          Payment Successful!
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Your order has been confirmed and payment processed successfully. 
          A confirmation email will be sent to {user?.email}.
        </p>
        <button
          onClick={onContinueShopping}
          className="font-orbitron text-lg inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <section className="animate-fade-in">
      {currentStep === 'review' && renderReviewStep()}
      {currentStep === 'payment' && renderPaymentStep()}
      {currentStep === 'success' && renderSuccessStep()}
    </section>
  );
};
