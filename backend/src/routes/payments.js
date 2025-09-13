import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';
import StripeService from '../services/stripeService.js';

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', authenticateToken, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').optional().isString().withMessage('Currency must be a string'),
  body('orderId').optional().isString().withMessage('Order ID must be a string'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, currency = 'usd', orderId } = req.body;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const metadata = {
      userId: req.user.id,
      userEmail: req.user.email,
      ...(orderId && { orderId })
    };

    const result = await StripeService.createPaymentIntent(amount, currency, metadata);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment intent',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId
      }
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get payment intent status
router.get('/payment-intent/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await StripeService.getPaymentIntent(id);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment intent',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        paymentIntent: result.paymentIntent
      }
    });

  } catch (error) {
    console.error('Get payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Confirm payment and update order
router.post('/confirm-payment', authenticateToken, [
  body('paymentIntentId').isString().withMessage('Payment intent ID is required'),
  body('orderId').isString().withMessage('Order ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { paymentIntentId, orderId } = req.body;

    // Get payment intent from Stripe
    const paymentResult = await StripeService.getPaymentIntent(paymentIntentId);

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment intent',
        error: paymentResult.error
      });
    }

    const paymentIntent = paymentResult.paymentIntent;

    // Check if payment was successful
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status
      });
    }

    // Update order in database
    const order = await prisma.order.update({
      where: {
        id: orderId,
        userId: req.user.id
      },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        paymentMethod: 'stripe',
        updatedAt: new Date()
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        order,
        paymentIntent
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create customer
router.post('/create-customer', authenticateToken, async (req, res) => {
  try {
    const { email, name } = req.body;

    const result = await StripeService.createCustomer(
      email || req.user.email,
      name || `${req.user.firstName} ${req.user.lastName}`,
      { userId: req.user.id }
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create customer',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        customer: result.customer
      }
    });

  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get customer payment methods
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required'
      });
    }

    const result = await StripeService.getCustomerPaymentMethods(customerId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment methods',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        paymentMethods: result.paymentMethods
      }
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment methods',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create refund
router.post('/refund', authenticateToken, [
  body('paymentIntentId').isString().withMessage('Payment intent ID is required'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { paymentIntentId, amount, reason = 'requested_by_customer' } = req.body;

    const result = await StripeService.createRefund(paymentIntentId, amount, reason);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create refund',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Refund created successfully',
      data: {
        refund: result.refund
      }
    });

  } catch (error) {
    console.error('Create refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create refund',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing stripe signature'
      });
    }

    const result = StripeService.verifyWebhookSignature(req.body, signature);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature',
        error: result.error
      });
    }

    const event = result.event;

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Update order status in database
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle payment failure
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ success: true, received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
