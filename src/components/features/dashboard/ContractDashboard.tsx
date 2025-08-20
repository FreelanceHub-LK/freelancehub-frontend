'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  MessageCircle,
  Download,
  Upload,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import { contractApi, type Contract } from '@/lib/api/contracts';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import Image from 'next/image';

interface ContractDashboardProps {
  userRole?: 'freelancer' | 'client';
}

export default function ContractDashboard({ userRole = 'freelancer' }: ContractDashboardProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // Selected contract for detailed view
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    filterAndSortContracts();
  }, [contracts, searchTerm, statusFilter, sortBy]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await contractApi.getMyContracts({});
      setContracts(response.contracts);
    } catch (err) {
      setError('Failed to load contracts');
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortContracts = () => {
    let filtered = contracts.filter(contract => {
      const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contract.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort contracts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'oldest':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'value-high':
          return b.totalAmount - a.totalAmount;
        case 'value-low':
          return a.totalAmount - b.totalAmount;
        case 'deadline':
          return new Date(a.expectedEndDate).getTime() - new Date(b.expectedEndDate).getTime();
        default:
          return 0;
      }
    });

    setFilteredContracts(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractStats = () => {
    const total = contracts.length;
    const active = contracts.filter(c => c.status === 'active').length;
    const completed = contracts.filter(c => c.status === 'completed').length;
    const totalValue = contracts.reduce((sum, contract) => sum + contract.totalAmount, 0);
    
    return { total, active, completed, totalValue };
  };

  const handleContractAction = async (contractId: string, action: string) => {
    try {
      switch (action) {
        case 'complete':
          await contractApi.completeContract(contractId);
          break;
        case 'cancel':
          await contractApi.terminateContract(contractId, 'User requested cancellation');
          break;
        case 'dispute':
          // This would typically open a dispute modal
          console.log('Opening dispute for contract:', contractId);
          break;
      }
      fetchContracts(); // Refresh the list
    } catch (err) {
      console.error(`Error performing ${action} on contract:`, err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchContracts} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const stats = getContractStats();

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-600 mt-1">Manage your active contracts and agreements</p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <Link href="/contracts/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Contract
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="disputed">Disputed</option>
            </Select>
            
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="value-high">Highest Value</option>
              <option value="value-low">Lowest Value</option>
              <option value="deadline">By Deadline</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Contracts ({filteredContracts.length})
          </h3>
        </CardHeader>
        <CardContent>
          {filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'You haven\'t created any contracts yet'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link href="/contracts/create">
                  <Button>Create Your First Contract</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contract</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      {userRole === 'freelancer' ? 'Client' : 'Freelancer'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Start Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Deadline</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract) => (
                    <tr key={contract._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowDetails(true);
                                }}>
                              {contract.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {contract.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {(userRole === 'freelancer' ? contract.client?.profilePicture : contract.freelancer?.profilePicture) ? (
                            <Image
                              src={userRole === 'freelancer' ? contract.client!.profilePicture! : contract.freelancer!.profilePicture!}
                              alt="Profile"
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {userRole === 'freelancer' 
                                ? `${contract.client?.firstName} ${contract.client?.lastName}`
                                : `${contract.freelancer?.firstName} ${contract.freelancer?.lastName}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className="font-medium text-green-600">
                          {formatCurrency(contract.totalAmount)}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {new Date(contract.startDate).toLocaleDateString()}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(contract.expectedEndDate).toLocaleDateString()}
                          </span>
                          {new Date(contract.expectedEndDate) < new Date() && contract.status === 'active' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status.toUpperCase()}
                        </Badge>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedContract(contract);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          <Link href={`/messages?contract=${contract._id}`}>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                          </Link>
                          
                          {contract.status === 'active' && (
                            <div className="relative group">
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="py-1">
                                  {userRole === 'freelancer' && (
                                    <button
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      onClick={() => handleContractAction(contract._id, 'complete')}
                                    >
                                      Mark Complete
                                    </button>
                                  )}
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    onClick={() => handleContractAction(contract._id, 'dispute')}
                                  >
                                    Open Dispute
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    onClick={() => handleContractAction(contract._id, 'cancel')}
                                  >
                                    Cancel Contract
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Details Modal */}
      {showDetails && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedContract.title}</h2>
                  <Badge className={`mt-2 ${getStatusColor(selectedContract.status)}`}>
                    {selectedContract.status.toUpperCase()}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contract Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-medium">{formatCurrency(selectedContract.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span>{new Date(selectedContract.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span>{new Date(selectedContract.expectedEndDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Type:</span>
                      <span className="capitalize">{selectedContract.paymentTerms.paymentSchedule}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {userRole === 'freelancer' ? 'Client' : 'Freelancer'}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {userRole === 'freelancer' 
                          ? `${selectedContract.client?.firstName} ${selectedContract.client?.lastName}`
                          : `${selectedContract.freelancer?.firstName} ${selectedContract.freelancer?.lastName}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {userRole === 'freelancer' ? 'Client' : 'Freelancer'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedContract.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedContract.description}
                  </p>
                </div>
              )}

              {selectedContract.milestones && selectedContract.milestones.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Milestones</h3>
                  <div className="space-y-3">
                    {selectedContract.milestones.map((milestone, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                          <Badge className={milestone.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {milestone.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 font-medium">
                            {formatCurrency(milestone.amount)}
                          </span>
                          <span className="text-gray-500">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Link href={`/messages?contract=${selectedContract._id}`}>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </Link>
                
                {selectedContract.status === 'active' && userRole === 'freelancer' && (
                  <Button
                    onClick={() => handleContractAction(selectedContract._id, 'complete')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
