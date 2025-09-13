import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { LoadingSpinner } from './LoadingSpinner';
import paymentService from '../services/paymentService';

interface PaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      '::placeholder': {
        color: '#9ca3af',
      },
      backgroundColor: '#374151',
    },
    invalid: {
      color: '#ef4444',
    },
  },
  hidePostalCode: false,
};

export const PaymentForm: React.FC<PaymentFormProps> = ({ amount, orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const paymentIntentResponse = await paymentService.createPaymentIntent(amount, 'usd', orderId);

      if (!paymentIntentResponse.success || !paymentIntentResponse.data) {
        throw new Error(paymentIntentResponse.error || 'Failed to create payment intent');
      }

      const { clientSecret } = paymentIntentResponse.data;

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm payment with backend
        const confirmResponse = await paymentService.confirmPayment(paymentIntent.id, orderId);

        if (!confirmResponse.success) {
          throw new Error(confirmResponse.error || 'Failed to confirm payment');
        }

        onSuccess(paymentIntent);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Card Details
        </label>
        <div className="p-4 bg-gray-700 border border-gray-600 rounded-md">
          <CardElement options={cardElementOptions} />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center text-lg">
          <span className="text-gray-300">Total Amount:</span>
          <span className="font-bold text-cyan-400">
            {paymentService.formatAmount(amount)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <LoadingSpinner className="w-5 h-5 mr-2" />
            Processing Payment...
          </>
        ) : (
          `Pay ${paymentService.formatAmount(amount)}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted.
      </p>
    </form>
  );
};
