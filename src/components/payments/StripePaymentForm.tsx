'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { AlertCircle, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripePaymentFormProps {
  amount: number;
  currency: string;
  onPayment: (paymentData: any) => void;
  isProcessing: boolean;
}

function StripePaymentFormContent({
  amount,
  currency,
  onPayment,
  isProcessing
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe is not loaded. Please refresh the page.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          method: 'stripe',
          // Add other required fields
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPayment({
          paymentIntentId: paymentIntent.id,
          paymentMethodId: paymentIntent.payment_method,
          status: paymentIntent.status
        });
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="error" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <div>{error}</div>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="h-4 w-4 inline mr-2" />
              Card Information
            </label>
            <div className="p-3 border border-gray-300 rounded-md bg-white">
              <CardElement
                options={cardElementOptions}
                onChange={(event: any) => {
                  if (event.error) {
                    setError(event.error.message);
                  } else {
                    setError(null);
                  }
                }}
              />
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Amount: {formatAmount(amount)} {currency.toUpperCase()}
          </div>

          <Button
            type="submit"
            disabled={!stripe || isLoading || isProcessing}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay ${formatAmount(amount)} ${currency.toUpperCase()}`
            )}
          </Button>
        </form>

        <div className="text-xs text-gray-500 text-center mt-4">
          Your payment is secured by Stripe
        </div>
      </CardContent>
    </Card>
  );
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <div>Stripe is not configured. Please contact support.</div>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentFormContent {...props} />
    </Elements>
  );
}
