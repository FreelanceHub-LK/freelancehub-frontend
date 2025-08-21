'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, MessageSquare, FileText, User, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Alert } from '../ui/Alert';
import Badge from '../ui/Badge';
import { disputeApi, Dispute, CreateDisputeDto, AddEvidenceDto, AddMessageDto } from '../../lib/api/disputes';

interface DisputeManagementProps {
  projectId?: string;
  contractId?: string;
  paymentId?: string;
  respondentId?: string;
  onDisputeCreated?: (dispute: Dispute) => void;
  viewMode?: 'create' | 'view' | 'manage';
  disputeId?: string;
}

export function DisputeManagement({
  projectId,
  contractId,
  paymentId,
  respondentId,
  onDisputeCreated,
  viewMode = 'create',
  disputeId
}: DisputeManagementProps) {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [disputeForm, setDisputeForm] = useState<CreateDisputeDto>({
    title: '',
    description: '',
    projectId: projectId || '',
    contractId: contractId,
    paymentId: paymentId,
    respondentId: respondentId || '',
    category: 'other',
    evidence: [{ description: '', attachments: [] }],
    isUrgent: false
  });

  const [newEvidence, setNewEvidence] = useState<AddEvidenceDto>({
    description: '',
    attachments: []
  });

  const [newMessage, setNewMessage] = useState<AddMessageDto>({
    message: '',
    isPublic: true
  });

  useEffect(() => {
    if (viewMode !== 'create' && disputeId) {
      loadDispute();
    }
  }, [disputeId, viewMode]);

  const loadDispute = async () => {
    if (!disputeId) return;
    
    setIsLoading(true);
    try {
      const response = await disputeApi.getDispute(disputeId);
      setDispute(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dispute');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeForm.title || !disputeForm.description || !disputeForm.respondentId) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await disputeApi.createDispute(disputeForm);
      setSuccess('Dispute created successfully');
      setDispute(response.data);
      onDisputeCreated?.(response.data);
      
      // Reset form
      setDisputeForm({
        title: '',
        description: '',
        projectId: projectId || '',
        contractId: contractId,
        paymentId: paymentId,
        respondentId: respondentId || '',
        category: 'other',
        evidence: [{ description: '', attachments: [] }],
        isUrgent: false
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create dispute');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvidence = async () => {
    if (!dispute || !newEvidence.description) return;

    setIsLoading(true);
    try {
      const response = await disputeApi.addEvidence(dispute._id, newEvidence);
      setDispute(response.data);
      setNewEvidence({ description: '', attachments: [] });
      setSuccess('Evidence added successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add evidence');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMessage = async () => {
    if (!dispute || !newMessage.message) return;

    setIsLoading(true);
    try {
      const response = await disputeApi.addMessage(dispute._id, newMessage);
      setDispute(response.data);
      setNewMessage({ message: '', isPublic: true });
      setSuccess('Message added successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (status: Dispute['status']) => {
    if (!dispute) return;

    setIsLoading(true);
    try {
      const response = await disputeApi.updateStatus(dispute._id, status);
      setDispute(response.data);
      setSuccess(`Dispute status updated to ${status}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Dispute['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'evidence_gathering': return 'bg-orange-100 text-orange-800';
      case 'arbitration': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Dispute['category']) => {
    switch (category) {
      case 'payment': return 'bg-red-100 text-red-800';
      case 'quality': return 'bg-orange-100 text-orange-800';
      case 'deadline': return 'bg-yellow-100 text-yellow-800';
      case 'scope': return 'bg-blue-100 text-blue-800';
      case 'communication': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'create') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            Create Dispute
          </h2>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mb-4">
              {success}
            </Alert>
          )}

          <form onSubmit={handleCreateDispute} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={disputeForm.title}
                  onChange={(e) => setDisputeForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the dispute"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={disputeForm.category}
                  onChange={(e) => setDisputeForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="payment">Payment Issue</option>
                  <option value="quality">Quality Concerns</option>
                  <option value="deadline">Deadline Problems</option>
                  <option value="scope">Scope Disagreement</option>
                  <option value="communication">Communication Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={disputeForm.description}
                onChange={(e) => setDisputeForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the dispute..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            {disputeForm.category === 'payment' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Disputed Amount</label>
                  <Input
                    type="number"
                    value={disputeForm.amount?.value || ''}
                    onChange={(e) => setDisputeForm(prev => ({ 
                      ...prev, 
                      amount: { 
                        value: parseFloat(e.target.value) || 0, 
                        currency: prev.amount?.currency || 'USD' 
                      } 
                    }))}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={disputeForm.amount?.currency || 'USD'}
                    onChange={(e) => setDisputeForm(prev => ({ 
                      ...prev, 
                      amount: { 
                        value: prev.amount?.value || 0, 
                        currency: e.target.value 
                      } 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Initial Evidence</label>
              <textarea
                value={disputeForm.evidence[0]?.description || ''}
                onChange={(e) => setDisputeForm(prev => ({ 
                  ...prev, 
                  evidence: [{ description: e.target.value, attachments: [] }]
                }))}
                placeholder="Describe your evidence or supporting information..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="urgent"
                checked={disputeForm.isUrgent}
                onChange={(e) => setDisputeForm(prev => ({ ...prev, isUrgent: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="urgent" className="text-sm font-medium">
                Mark as urgent
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Dispute'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (!dispute && isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Dispute not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{dispute.title}</h2>
            <div className="flex gap-2 mb-4">
              <Badge className={getStatusColor(dispute.status)}>
                {dispute.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className={getCategoryColor(dispute.category)}>
                {dispute.category.toUpperCase()}
              </Badge>
              {dispute.isUrgent && (
                <Badge className="bg-red-100 text-red-800">URGENT</Badge>
              )}
            </div>
          </div>
          
          {viewMode === 'manage' && (
            <div className="flex gap-2">
              {dispute.status === 'open' && (
                <Button
                  onClick={() => handleUpdateStatus('in_review')}
                  disabled={isLoading}
                  size="sm"
                >
                  Start Review
                </Button>
              )}
              {dispute.status === 'in_review' && (
                <Button
                  onClick={() => handleUpdateStatus('evidence_gathering')}
                  disabled={isLoading}
                  size="sm"
                >
                  Gather Evidence
                </Button>
              )}
              {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
                <Button
                  onClick={() => handleUpdateStatus('resolved')}
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Resolve
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success">
            {success}
          </Alert>
        )}

        {/* Dispute Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 mb-6">{dispute.description}</p>

            {dispute.amount && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Disputed Amount</h3>
                <p className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: dispute.amount.currency,
                  }).format(dispute.amount.value)}
                </p>
              </div>
            )}

            {/* Resolution */}
            {dispute.resolution && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-green-600">Resolution</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">{dispute.resolution.decision}</p>
                  <p className="text-sm text-gray-600">{dispute.resolution.reasoning}</p>
                  {dispute.resolution.compensationAmount && (
                    <p className="text-lg font-semibold text-green-600 mt-2">
                      Compensation: {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: dispute.amount?.currency || 'USD',
                      }).format(dispute.resolution.compensationAmount)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Participants</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Claimant</p>
                  <p className="text-sm text-gray-600">
                    {dispute.claimant?.firstName} {dispute.claimant?.lastName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Respondent</p>
                  <p className="text-sm text-gray-600">
                    {dispute.respondent?.firstName} {dispute.respondent?.lastName}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Timeline</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Created: {new Date(dispute.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Clock className="w-4 h-4" />
                Updated: {new Date(dispute.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Evidence
          </h3>
          
          <div className="space-y-3 mb-4">
            {dispute.evidence.map((evidence, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">{evidence.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  Submitted by {evidence.submittedBy}
                  <span className="mx-2">•</span>
                  {new Date(evidence.submittedAt).toLocaleDateString()}
                </div>
                {evidence.attachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Attachments:</p>
                    <ul className="list-disc list-inside text-sm text-blue-600">
                      {evidence.attachments.map((attachment, i) => (
                        <li key={i}>
                          <a href={attachment} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Attachment {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Evidence Form */}
          {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Add Evidence</h4>
              <textarea
                value={newEvidence.description}
                onChange={(e) => setNewEvidence(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your evidence..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                rows={3}
              />
              <Button
                onClick={handleAddEvidence}
                disabled={isLoading || !newEvidence.description}
                size="sm"
              >
                Add Evidence
              </Button>
            </div>
          )}
        </div>

        {/* Messages Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Messages
          </h3>
          
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {dispute.messages.map((message, index) => (
              <div key={index} className={`p-3 rounded-lg ${message.isPublic ? 'bg-gray-50' : 'bg-yellow-50'}`}>
                <p className="text-gray-700 mb-2">{message.message}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  {message.senderId}
                  <span className="mx-2">•</span>
                  {new Date(message.timestamp).toLocaleString()}
                  {!message.isPublic && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-yellow-600 font-medium">Private</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Message Form */}
          {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Add Message</h4>
              <textarea
                value={newMessage.message}
                onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Type your message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                rows={3}
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newMessage.isPublic}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="text-sm">
                    Public message
                  </label>
                </div>
                <Button
                  onClick={handleAddMessage}
                  disabled={isLoading || !newMessage.message}
                  size="sm"
                >
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
