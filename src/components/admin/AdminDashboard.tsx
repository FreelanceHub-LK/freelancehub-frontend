'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Star,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import Badge from '../ui/Badge';
import { analyticsApi } from '../../lib/api/analytics';
import { disputeApi, DisputeStats } from '../../lib/api/disputes';
import { clientApi, ClientStats } from '../../lib/api/clients';
import { freelancerApi } from '../../lib/api/freelancer';

interface AdminDashboardProps {
  className?: string;
}

interface FreelancerStats {
  totalFreelancers: number;
  verifiedFreelancers: number;
  averageRating: number;
  averageHourlyRate: number;
  successRate: number;
  topSkills: { skill: string; count: number }[];
}

interface DashboardStats {
  totalUsers: number;
  totalFreelancers: number;
  totalClients: number;
  totalProjects: number;
  totalContracts: number;
  totalRevenue: number;
  platformFee: number;
  activeDisputes: number;
  pendingVerifications: number;
  monthlyGrowth: number;
}

export function AdminDashboard({ className = '' }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [disputeStats, setDisputeStats] = useState<DisputeStats | null>(null);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [freelancerStats, setFreelancerStats] = useState<FreelancerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Map UI periods to API periods
      const periodMap = {
        '7d': 'week',
        '30d': 'month', 
        '90d': 'month',
        '1y': 'year'
      } as const;

      const [analyticsResult, disputesResult, clientsResult] = await Promise.allSettled([
        analyticsApi.getPlatformAnalytics({ period: periodMap[selectedPeriod] }),
        disputeApi.getDisputeStats(),
        clientApi.getClientStats()
      ]);

      // Handle analytics data
      if (analyticsResult.status === 'fulfilled') {
        const analyticsData = analyticsResult.value.data;
        setStats({
          totalUsers: analyticsData.userStats.totalUsers,
          totalFreelancers: analyticsData.userStats.totalFreelancers,
          totalClients: analyticsData.userStats.totalClients,
          totalProjects: analyticsData.projectStats.totalProjects,
          totalContracts: analyticsData.projectStats.completedProjects,
          totalRevenue: analyticsData.financialStats.totalRevenue,
          platformFee: analyticsData.financialStats.platformFees,
          activeDisputes: 0, // Will be updated from dispute stats
          pendingVerifications: 0, // Placeholder
          monthlyGrowth: 5.2 // Placeholder
        });
      }

      // Handle dispute stats
      if (disputesResult.status === 'fulfilled') {
        setDisputeStats(disputesResult.value.data);
        // Update active disputes in stats
        setStats(prev => prev ? { ...prev, activeDisputes: disputesResult.value.data.open } : null);
      }

      // Handle client stats
      if (clientsResult.status === 'fulfilled') {
        setClientStats(clientsResult.value.data);
      }

      // Create mock freelancer stats
      setFreelancerStats({
        totalFreelancers: 1250,
        verifiedFreelancers: 980,
        averageRating: 4.6,
        averageHourlyRate: 45,
        successRate: 92.5,
        topSkills: [
          { skill: 'JavaScript', count: 320 },
          { skill: 'Python', count: 280 },
          { skill: 'React', count: 250 }
        ]
      });

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and management</p>
        </div>
        
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === '7d' ? '7 Days' : 
               period === '30d' ? '30 Days' : 
               period === '90d' ? '90 Days' : '1 Year'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">{formatPercent(stats.monthlyGrowth)}</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-500">Platform Fee: </span>
                <span className="text-gray-900 font-medium ml-1">{formatCurrency(stats.platformFee)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects.toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-500">Contracts: </span>
                <span className="text-gray-900 font-medium ml-1">{stats.totalContracts.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Disputes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeDisputes}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-500">Pending: </span>
                <span className="text-red-600 font-medium ml-1">{stats.pendingVerifications}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Distribution
            </h3>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">Freelancers</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{stats.totalFreelancers.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      {((stats.totalFreelancers / stats.totalUsers) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Clients</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{stats.totalClients.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      {((stats.totalClients / stats.totalUsers) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Platform Health
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dispute Resolution Rate</span>
                <div className="flex items-center gap-2">
                  {disputeStats && (
                    <>
                      <span className="text-lg font-semibold">
                        {((disputeStats.resolved / disputeStats.total) * 100).toFixed(1)}%
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <div className="flex items-center gap-2">
                  {freelancerStats && (
                    <>
                      <span className="text-lg font-semibold">
                        {freelancerStats.averageRating.toFixed(1)}
                      </span>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Project Success Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">92.5%</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Disputes</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {disputeStats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{disputeStats.open}</p>
                    <p className="text-xs text-gray-500">Open</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{disputeStats.inReview}</p>
                    <p className="text-xs text-gray-500">In Review</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{disputeStats.resolved}</p>
                    <p className="text-xs text-gray-500">Resolved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">{disputeStats.total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/admin/users'}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/admin/disputes'}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              View Disputes
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/admin/analytics'}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/admin/payments'}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Payments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Platform Statistics */}
      {clientStats && freelancerStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Client Insights</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verified Clients</span>
                  <Badge className="bg-green-100 text-green-800">
                    {clientStats.verifiedClients}/{clientStats.totalClients}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Project Value</span>
                  <span className="font-semibold">{formatCurrency(clientStats.averageProjectValue)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Repeat Client Rate</span>
                  <span className="font-semibold">{clientStats.repeatClientRate.toFixed(1)}%</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Top Industries</span>
                  <div className="space-y-1">
                    {clientStats.topIndustries.slice(0, 3).map((industry, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{industry.industry}</span>
                        <span>{industry.count} clients</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Freelancer Insights</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verified Freelancers</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {freelancerStats.verifiedFreelancers}/{freelancerStats.totalFreelancers}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Hourly Rate</span>
                  <span className="font-semibold">{formatCurrency(freelancerStats.averageHourlyRate)}/hr</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold">{freelancerStats.successRate.toFixed(1)}%</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Top Skills</span>
                  <div className="space-y-1">
                    {freelancerStats.topSkills.slice(0, 3).map((skill, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{skill.skill}</span>
                        <span>{skill.count} freelancers</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
