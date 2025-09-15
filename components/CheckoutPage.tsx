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
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Cart
        </button>
      </div>

      <h2 className="text-heading-2 md:text-heading-1 text-primary mb-8 text-center">
        Review Your Order
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-primary mb-4">Order Items</h3>
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center bg-white border border-light rounded-2xl p-4 gap-4 shadow-md">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-grow">
                <h4 className="font-semibold text-primary">{item.name}</h4>
                <p className="text-body-sm text-muted">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-accent">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-light rounded-2xl p-6 shadow-md">
          <h3 className="text-heading-4 text-primary mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary">Subtotal</span>
              <span className="text-primary">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Tax (8%)</span>
              <span className="text-primary">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Shipping</span>
              <span className="text-primary">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-light pt-3">
              <div className="flex justify-between text-body-lg font-semibold">
                <span className="text-primary">Total</span>
                <span className="text-accent">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={isCreatingOrder}
            className="w-full mt-6 bg-accent hover:bg-accent-hover disabled:bg-muted disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
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
        <div className="mt-6 p-4 bg-error/10 border border-error rounded-lg">
          <p className="text-error">{error}</p>
        </div>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentStep('review')}
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Review
        </button>
      </div>

      <h2 className="text-heading-2 md:text-heading-1 text-primary mb-8 text-center">
        Payment
      </h2>

      <div className="bg-white border border-light rounded-2xl p-8 shadow-md">
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
        <div className="mt-6 p-4 bg-error/10 border border-error rounded-lg">
          <p className="text-error">{error}</p>
        </div>
      )}
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-2xl mx-auto text-center animate-fade-in py-16">
      <div className="bg-white border border-light rounded-2xl p-12 flex flex-col items-center shadow-xl">
        <CheckCircleIcon className="w-20 h-20 text-success mb-6" />
        <h2 className="text-heading-2 md:text-heading-1 text-primary mb-4">
          Payment Successful!
        </h2>
        <p className="text-body-lg text-secondary mb-8">
          Your order has been confirmed and payment processed successfully. 
          A confirmation email will be sent to {user?.email}.
        </p>
        <button
          onClick={onContinueShopping}
          className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/30"
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
