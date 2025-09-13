import apiService from './apiService';

interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

interface Refund {
  id: string;
  amount: number;
  status: string;
  reason: string;
  created: number;
}

class PaymentService {
  // Create payment intent
  async createPaymentIntent(amount: number, currency = 'usd', orderId?: string): Promise<{ success: boolean; data?: PaymentIntent; error?: string }> {
    try {
      const response = await apiService.request<PaymentIntent>('/payments/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify({ amount, currency, orderId }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment intent',
      };
    }
  }

  // Get payment intent status
  async getPaymentIntentStatus(paymentIntentId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiService.request<any>(`/payments/payment-intent/${paymentIntentId}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get payment status',
      };
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId: string, orderId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiService.request<any>('/payments/confirm-payment', {
        method: 'POST',
        body: JSON.stringify({ paymentIntentId, orderId }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to confirm payment',
      };
    }
  }

  // Create customer
  async createCustomer(email?: string, name?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiService.request<any>('/payments/create-customer', {
        method: 'POST',
        body: JSON.stringify({ email, name }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create customer',
      };
    }
  }

  // Get customer payment methods
  async getPaymentMethods(customerId: string): Promise<{ success: boolean; data?: { paymentMethods: PaymentMethod[] }; error?: string }> {
    try {
      const response = await apiService.request<{ paymentMethods: PaymentMethod[] }>(`/payments/payment-methods?customerId=${customerId}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get payment methods',
      };
    }
  }

  // Create refund
  async createRefund(paymentIntentId: string, amount?: number, reason = 'requested_by_customer'): Promise<{ success: boolean; data?: { refund: Refund }; error?: string }> {
    try {
      const response = await apiService.request<{ refund: Refund }>('/payments/refund', {
        method: 'POST',
        body: JSON.stringify({ paymentIntentId, amount, reason }),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create refund',
      };
    }
  }

  // Format amount for display
  formatAmount(amount: number, currency = 'usd'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }

  // Format amount for Stripe (convert to cents)
  formatAmountForStripe(amount: number): number {
    return Math.round(amount * 100);
  }

  // Format amount from Stripe (convert from cents)
  formatAmountFromStripe(amount: number): number {
    return amount / 100;
  }
}

export const paymentService = new PaymentService();
export default paymentService;
