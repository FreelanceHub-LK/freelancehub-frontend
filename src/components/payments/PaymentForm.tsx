'use client';

import React, { useState } from 'react';
import { CreditCard, Banknote, Wallet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Alert } from '../ui/Alert';
import Badge from '../ui/Badge';
import { paymentApi, CreatePaymentDto, PaymentResponse } from '../../lib/api/payments';
import { StripePaymentForm } from './StripePaymentForm';
import { PayPalPaymentForm } from './PayPalPaymentForm';

interface PaymentFormProps {
  projectId?: string;
  contractId?: string;
  recipientId: string;
  amount: number;
  currency?: string;
  description?: string;
  type?: 'project_payment' | 'milestone_payment' | 'escrow_release';
  escrowEnabled?: boolean;
  onSuccess?: (payment: PaymentResponse) => void;
  onError?: (error: string) => void;
}

export function PaymentForm({
  projectId,
  contractId,
  recipientId,
  amount,
  currency = 'USD',
  description,
  type = 'project_payment',
  escrowEnabled = false,
  onSuccess,
  onError
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'paypal' | 'wallet'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<PaymentResponse | null>(null);
  const [escrowSettings, setEscrowSettings] = useState({
    enabled: escrowEnabled,
    autoRelease: true,
    autoReleaseDays: 14,
    conditions: [''] as string[]
  });

  const paymentMethods = [
    {
      id: 'stripe' as const,
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Pay securely with your card',
      fees: '2.9% + $0.30'
    },
    {
      id: 'paypal' as const,
      name: 'PayPal',
      icon: <Banknote className="w-5 h-5" />,
      description: 'Pay with your PayPal account',
      fees: '2.9% + $0.30'
    },
    {
      id: 'wallet' as const,
      name: 'Wallet Balance',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Pay from your wallet balance',
      fees: 'No fees'
    }
  ];

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const calculateFees = (amount: number, method: string) => {
    switch (method) {
      case 'stripe':
      case 'paypal':
        return Math.round(amount * 0.029 + 30); // 2.9% + $0.30
      default:
        return 0;
    }
  };

  const totalAmount = amount + calculateFees(amount, selectedMethod);

  const handleEscrowConditionAdd = () => {
    setEscrowSettings(prev => ({
      ...prev,
      conditions: [...prev.conditions, '']
    }));
  };

  const handleEscrowConditionChange = (index: number, value: string) => {
    setEscrowSettings(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => i === index ? value : condition)
    }));
  };

  const handleEscrowConditionRemove = (index: number) => {
    setEscrowSettings(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handlePayment = async (paymentData?: any) => {
    try {
      setIsProcessing(true);
      setError(null);

      const paymentRequest: CreatePaymentDto = {
        amount: totalAmount,
        currency,
        type: 'project_payment',
        method: selectedMethod,
        payerId: recipientId, // This should actually be the current user's ID
        recipientId: recipientId,
        projectId: projectId,
        contractId: contractId,
        description: description || 'Payment for project services',
        escrowDetails: escrowSettings.enabled ? {
          isEscrow: true,
          releaseConditions: escrowSettings.conditions.filter(c => c.trim()),
          autoReleaseEnabled: escrowSettings.autoRelease,
          autoReleaseDays: escrowSettings.autoReleaseDays,
        } : undefined,
        metadata: paymentData || {}
      };

      const response = await paymentApi.createPayment(paymentRequest);
      
      const paymentResponse: PaymentResponse = {
        payment: response.data,
        status: 'success',
        message: 'Payment created successfully'
      };
      
      setSuccess(paymentResponse);
      onSuccess?.(paymentResponse);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Initiated</h3>
            <p className="text-gray-600 mb-4">{success.message}</p>
            {success.redirectUrl && (
              <Button
                onClick={() => window.open(success.redirectUrl, '_blank')}
                className="w-full"
              >
                Complete Payment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Payment Summary</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium">{formatAmount(amount, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Fee:</span>
            <span className="font-medium">{formatAmount(calculateFees(amount, selectedMethod), currency)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span>{formatAmount(totalAmount, currency)}</span>
          </div>
          {description && (
            <div className="text-sm text-gray-600">
              <strong>Description:</strong> {description}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Payment Method</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {method.icon}
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                </div>
                <Badge variant={method.fees === 'No fees' ? 'success' : 'secondary'}>
                  {method.fees}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Escrow Settings */}
      {type === 'project_payment' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Escrow Protection</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="escrow-enabled"
                checked={escrowSettings.enabled}
                onChange={(e) => setEscrowSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="escrow-enabled" className="text-sm font-medium">
                Use escrow protection
              </label>
            </div>
            
            {escrowSettings.enabled && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto-release"
                    checked={escrowSettings.autoRelease}
                    onChange={(e) => setEscrowSettings(prev => ({ ...prev, autoRelease: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="auto-release" className="text-sm">
                    Auto-release funds after
                  </label>
                  <Input
                    type="number"
                    value={escrowSettings.autoReleaseDays}
                    onChange={(e) => setEscrowSettings(prev => ({ ...prev, autoReleaseDays: parseInt(e.target.value) }))}
                    className="w-20"
                    min="1"
                    max="365"
                  />
                  <span className="text-sm">days</span>
                </div>

                <div>
                  <label className="text-sm font-medium">Release Conditions:</label>
                  {escrowSettings.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <Input
                        placeholder="Enter release condition"
                        value={condition}
                        onChange={(e) => handleEscrowConditionChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEscrowConditionRemove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEscrowConditionAdd}
                    className="mt-2"
                  >
                    Add Condition
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <div>{error}</div>
        </Alert>
      )}

      {/* Payment Form */}
      {selectedMethod === 'stripe' && (
        <StripePaymentForm
          amount={totalAmount}
          currency={currency}
          onPayment={handlePayment}
          isProcessing={isProcessing}
        />
      )}

      {selectedMethod === 'paypal' && (
        <PayPalPaymentForm
          amount={totalAmount}
          currency={currency}
          onPayment={handlePayment}
          isProcessing={isProcessing}
        />
      )}

      {selectedMethod === 'wallet' && (
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={() => handlePayment()}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatAmount(totalAmount, currency)} from Wallet`
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
