'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import Badge from '../ui/Badge';
import { 
  AlertCircle, 
  Shield, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Calendar,
  Users,
  FileText
} from 'lucide-react';

interface EscrowPayment {
  id: string;
  amount: number;
  currency: string;
  status: 'holding' | 'released' | 'disputed' | 'refunded';
  projectId: string;
  contractId: string;
  clientId: string;
  freelancerId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  releaseConditions: {
    requiresApproval: boolean;
    autoReleaseDate?: string;
    milestoneBased: boolean;
  };
  milestones?: {
    id: string;
    description: string;
    amount: number;
    status: 'pending' | 'completed' | 'approved';
    completedAt?: string;
  }[];
  projectTitle: string;
  clientName: string;
  freelancerName: string;
}

interface EscrowManagementProps {
  userRole: 'client' | 'freelancer';
  userId: string;
  projectId?: string;
  contractId?: string;
}

export function EscrowManagement({
  userRole,
  userId,
  projectId,
  contractId
}: EscrowManagementProps) {
  const [escrowPayments, setEscrowPayments] = useState<EscrowPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEscrowPayments();
  }, [userId, projectId, contractId]);

  const fetchEscrowPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('userId', userId);
      params.append('userRole', userRole);
      if (projectId) params.append('projectId', projectId);
      if (contractId) params.append('contractId', contractId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/escrow?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch escrow payments');
      }

      const data = await response.json();
      setEscrowPayments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load escrow payments');
    } finally {
      setIsLoading(false);
    }
  };

  const releaseEscrow = async (paymentId: string) => {
    try {
      setActionLoading(paymentId);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${paymentId}/release`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to release escrow payment');
      }

      await fetchEscrowPayments();
    } catch (err: any) {
      setError(err.message || 'Failed to release escrow payment');
    } finally {
      setActionLoading(null);
    }
  };

  const approveMilestone = async (paymentId: string, milestoneId: string) => {
    try {
      setActionLoading(`${paymentId}-${milestoneId}`);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${paymentId}/milestones/${milestoneId}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to approve milestone');
      }

      await fetchEscrowPayments();
    } catch (err: any) {
      setError(err.message || 'Failed to approve milestone');
    } finally {
      setActionLoading(null);
    }
  };

  const disputePayment = async (paymentId: string, reason: string) => {
    try {
      setActionLoading(paymentId);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${paymentId}/dispute`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to dispute payment');
      }

      await fetchEscrowPayments();
    } catch (err: any) {
      setError(err.message || 'Failed to dispute payment');
    } finally {
      setActionLoading(null);
    }
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
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'holding':
        return 'warning';
      case 'released':
        return 'success';
      case 'disputed':
        return 'danger';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'holding':
        return <Clock className="h-4 w-4" />;
      case 'released':
        return <CheckCircle className="h-4 w-4" />;
      case 'disputed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const canReleaseEscrow = (payment: EscrowPayment) => {
    return (
      userRole === 'client' &&
      payment.status === 'holding' &&
      (!payment.releaseConditions.milestoneBased ||
        payment.milestones?.every(m => m.status === 'approved'))
    );
  };

  const canApproveMilestone = (payment: EscrowPayment, milestone: any) => {
    return (
      userRole === 'client' &&
      payment.status === 'holding' &&
      milestone.status === 'completed'
    );
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
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Escrow Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {escrowPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No escrow payments found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {escrowPayments.map((payment) => (
              <div
                key={payment.id}
                className="border border-gray-200 rounded-lg p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {payment.projectTitle}
                      </h3>
                      <Badge variant={getStatusColor(payment.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </span>
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{payment.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="font-medium">
                          {formatAmount(payment.amount, payment.currency)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{formatDate(payment.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        <span>
                          {userRole === 'client' ? payment.freelancerName : payment.clientName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-gray-400" />
                        <span>Contract #{payment.contractId.slice(-6)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {payment.milestones && payment.milestones.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Milestones</h4>
                    <div className="space-y-2">
                      {payment.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{milestone.description}</span>
                              <Badge variant={
                                milestone.status === 'approved' ? 'success' :
                                milestone.status === 'completed' ? 'warning' : 'default'
                              }>
                                {milestone.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatAmount(milestone.amount, payment.currency)}
                            </div>
                          </div>
                          
                          {canApproveMilestone(payment, milestone) && (
                            <Button
                              size="sm"
                              onClick={() => approveMilestone(payment.id, milestone.id)}
                              disabled={actionLoading === `${payment.id}-${milestone.id}`}
                            >
                              {actionLoading === `${payment.id}-${milestone.id}` ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                'Approve'
                              )}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {payment.releaseConditions.autoReleaseDate && (
                  <div className="border-t pt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Auto-release date: {formatDate(payment.releaseConditions.autoReleaseDate)}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Last updated: {formatDate(payment.updatedAt)}
                  </div>
                  
                  <div className="flex space-x-2">
                    {payment.status === 'holding' && userRole === 'freelancer' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => disputePayment(payment.id, 'Work completed but payment not released')}
                        disabled={actionLoading === payment.id}
                      >
                        Dispute
                      </Button>
                    )}
                    
                    {canReleaseEscrow(payment) && (
                      <Button
                        onClick={() => releaseEscrow(payment.id)}
                        disabled={actionLoading === payment.id}
                      >
                        {actionLoading === payment.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          'Release Payment'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
