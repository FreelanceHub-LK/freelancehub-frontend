'use client';

import React, { useEffect, useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Card, CardContent } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { AlertCircle } from 'lucide-react';

interface PayPalPaymentFormProps {
  amount: number;
  currency: string;
  onPayment: (paymentData: any) => void;
  isProcessing: boolean;
}

export function PayPalPaymentForm({
  amount,
  currency,
  onPayment,
  isProcessing
}: PayPalPaymentFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: currency.toUpperCase(),
    intent: 'capture'
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  const createOrder = async () => {
    try {
      setError(null);
      
      // Call your backend to create the PayPal order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          method: 'paypal',
          // Add other required fields
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const data = await response.json();
      
      // Extract order ID from the redirect URL or metadata
      const orderIdMatch = data.redirectUrl?.match(/token=([^&]+)/);
      if (!orderIdMatch) {
        throw new Error('PayPal order ID not found');
      }

      return orderIdMatch[1];
    } catch (err: any) {
      setError(err.message || 'Failed to create PayPal order');
      throw err;
    }
  };

  const onApprove = async (data: any) => {
    try {
      setError(null);
      
      // Call your backend to capture the payment
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/paypal/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture PayPal payment');
      }

      const result = await response.json();
      onPayment({
        paypalOrderId: data.orderID,
        paypalPayerId: data.payerID,
        captureData: result
      });
    } catch (err: any) {
      setError(err.message || 'Failed to process PayPal payment');
    }
  };

  const onError = (err: any) => {
    console.error('PayPal error:', err);
    setError('PayPal payment failed. Please try again.');
  };

  const onCancel = () => {
    setError('PayPal payment was cancelled');
  };

  if (!paypalOptions.clientId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <div>PayPal is not configured. Please contact support.</div>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="error" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <div>{error}</div>
          </Alert>
        )}

        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal'
            }}
            disabled={isProcessing}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            forceReRender={[amount, currency]}
          />
        </PayPalScriptProvider>

        <div className="text-center text-sm text-gray-600 mt-4">
          Amount: {formatAmount(amount)} {currency.toUpperCase()}
        </div>
      </CardContent>
    </Card>
  );
}
