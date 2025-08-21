'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import Badge from '../ui/Badge';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  method: 'stripe' | 'paypal' | 'wallet';
  projectId?: string;
  contractId?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    stripePaymentIntentId?: string;
    paypalOrderId?: string;
    escrowReleased?: boolean;
    refundReason?: string;
  };
}

interface PaymentHistoryProps {
  userId?: string;
  projectId?: string;
  contractId?: string;
  showFilters?: boolean;
}

export function PaymentHistory({
  userId,
  projectId,
  contractId,
  showFilters = true
}: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    method: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchPayments();
  }, [userId, projectId, contractId]);

  useEffect(() => {
    applyFilters();
  }, [payments, filters]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (projectId) params.append('projectId', projectId);
      if (contractId) params.append('contractId', contractId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const data = await response.json();
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load payment history');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = payments;

    if (filters.status !== 'all') {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }

    if (filters.method !== 'all') {
      filtered = filtered.filter(payment => payment.method === filters.method);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(payment => 
        new Date(payment.createdAt) >= filterDate
      );
    }

    setFilteredPayments(filtered);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return '💳';
      case 'paypal':
        return '🅿️';
      case 'wallet':
        return '💰';
      default:
        return '💳';
    }
  };

  const exportPayments = () => {
    const csvContent = [
      ['Date', 'Amount', 'Currency', 'Status', 'Method', 'Description'].join(','),
      ...filteredPayments.map(payment => [
        formatDate(payment.createdAt),
        (payment.amount / 100).toString(),
        payment.currency.toUpperCase(),
        payment.status,
        payment.method,
        `"${payment.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <div>{error}</div>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Payment History
          </CardTitle>
          {filteredPayments.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportPayments}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={filters.method}
              onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Methods</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="wallet">Wallet</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
            </select>
          </div>
        )}

        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No payment history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(payment.status)}
                    <span className="text-2xl">{getMethodIcon(payment.method)}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {formatAmount(payment.amount, payment.currency)}
                      </span>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {payment.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(payment.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm text-gray-500">
                  <div className="capitalize">{payment.method}</div>
                  {payment.metadata?.escrowReleased && (
                    <div className="text-green-600 text-xs">Escrow Released</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
