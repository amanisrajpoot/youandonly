import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class StripeService {
  // Create a payment intent
  static async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Retrieve a payment intent
  static async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        success: true,
        paymentIntent,
      };
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Confirm a payment intent
  static async confirmPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      return {
        success: true,
        paymentIntent,
      };
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Create a refund
  static async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason,
      });

      return {
        success: true,
        refund,
      };
    } catch (error) {
      console.error('Error creating refund:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Create a customer
  static async createCustomer(email, name, metadata = {}) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata,
      });

      return {
        success: true,
        customer,
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Retrieve a customer
  static async getCustomer(customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      return {
        success: true,
        customer,
      };
    } catch (error) {
      console.error('Error retrieving customer:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Create a setup intent for saving payment methods
  static async createSetupIntent(customerId, metadata = {}) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        metadata,
      });

      return {
        success: true,
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
      };
    } catch (error) {
      console.error('Error creating setup intent:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // List customer's payment methods
  static async getCustomerPaymentMethods(customerId) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return {
        success: true,
        paymentMethods: paymentMethods.data,
      };
    } catch (error) {
      console.error('Error retrieving payment methods:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Create a webhook endpoint signature verification
  static verifyWebhookSignature(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return {
        success: true,
        event,
      };
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default StripeService;
