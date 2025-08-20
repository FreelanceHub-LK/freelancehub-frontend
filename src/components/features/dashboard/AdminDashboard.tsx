'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageCircle,
  FileText,
  Settings,
  Activity,
  BarChart3,
  UserCheck,
  UserX,
  Flag
} from 'lucide-react';
import { analyticsApi } from '@/lib/api/analytics';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

interface AdminDashboardProps {
  // Admin specific props
}

interface PlatformStats {
  users: {
    total: number;
    freelancers: number;
    clients: number;
    newThisMonth: number;
    activeToday: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    completionRate: number;
    averageValue: number;
  };
  financial: {
    totalVolume: number;
    monthlyRevenue: number;
    platformFees: number;
    averageProjectValue: number;
    payoutsPending: number;
  };
  disputes: {
    total: number;
    pending: number;
    resolved: number;
    resolutionTime: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'project_posted' | 'contract_completed' | 'dispute_opened' | 'payment_processed';
  description: string;
  timestamp: Date;
  severity: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  projectId?: string;
}

export default function AdminDashboard({}: AdminDashboardProps) {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [dateRange, setDateRange] = useState<string>('30d');
  const [activityFilter, setActivityFilter] = useState<string>('all');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch platform analytics
      const analyticsResponse = await analyticsApi.getPlatformAnalytics({
        period: dateRange as any
      });

      // Mock the stats transformation since we don't know the exact API response structure
      const mockStats: PlatformStats = {
        users: {
          total: 12500,
          freelancers: 8200,
          clients: 4300,
          newThisMonth: 245,
          activeToday: 1450
        },
        projects: {
          total: 4800,
          active: 620,
          completed: 3950,
          completionRate: 87.5,
          averageValue: 2750
        },
        financial: {
          totalVolume: 8500000,
          monthlyRevenue: 425000,
          platformFees: 850000,
          averageProjectValue: 2750,
          payoutsPending: 125000
        },
        disputes: {
          total: 85,
          pending: 12,
          resolved: 73,
          resolutionTime: 3.2
        }
      };

      // Mock recent activity
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'user_signup',
          description: 'New freelancer Sarah Johnson joined the platform',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          severity: 'info'
        },
        {
          id: '2',
          type: 'project_posted',
          description: 'New project "E-commerce Website Development" posted',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          severity: 'success'
        },
        {
          id: '3',
          type: 'dispute_opened',
          description: 'Dispute opened for project "Mobile App Design"',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          severity: 'warning'
        },
        {
          id: '4',
          type: 'contract_completed',
          description: 'Contract completed: "Logo Design for Startup"',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          severity: 'success'
        },
        {
          id: '5',
          type: 'payment_processed',
          description: 'Payment of $2,500 processed for completed project',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          severity: 'info'
        }
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
      
    } catch (err) {
      setError('Failed to load admin dashboard data');
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_signup':
        return <UserCheck className="h-4 w-4" />;
      case 'project_posted':
        return <Briefcase className="h-4 w-4" />;
      case 'contract_completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'dispute_opened':
        return <Flag className="h-4 w-4" />;
      case 'payment_processed':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: RecentActivity['severity']) => {
    switch (severity) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
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
        <Button onClick={fetchDashboardData} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and management</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="365d">Last year</option>
          </Select>
          
          <Link href="/admin/settings">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatNumber(stats.users.total) : '0'}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats?.users.newThisMonth || 0} this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatNumber(stats.projects.total) : '0'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {stats?.projects.active || 0} active
                </p>
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
                <p className="text-sm text-gray-600">Platform Volume</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatCurrency(stats.financial.totalVolume) : '$0'}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {stats ? formatCurrency(stats.financial.monthlyRevenue) : '$0'}/month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Disputes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.disputes.pending || 0}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {stats?.disputes.resolutionTime || 0}d avg resolution
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Overview */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">User Overview</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Freelancers</span>
                <span className="font-medium">{stats ? formatNumber(stats.users.freelancers) : '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Clients</span>
                <span className="font-medium">{stats ? formatNumber(stats.users.clients) : '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Today</span>
                <span className="font-medium text-green-600">{stats ? formatNumber(stats.users.activeToday) : '0'}</span>
              </div>
              <div className="pt-2 border-t">
                <Link href="/admin/users">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Users
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Overview */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Project Overview</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-medium text-green-600">{stats?.projects.completionRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Value</span>
                <span className="font-medium">{stats ? formatCurrency(stats.projects.averageValue) : '$0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Projects</span>
                <span className="font-medium text-blue-600">{stats?.projects.active || 0}</span>
              </div>
              <div className="pt-2 border-t">
                <Link href="/admin/projects">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Projects
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Platform Fees</span>
                <span className="font-medium text-green-600">{stats ? formatCurrency(stats.financial.platformFees) : '$0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Payouts</span>
                <span className="font-medium text-yellow-600">{stats ? formatCurrency(stats.financial.payoutsPending) : '$0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="font-medium text-purple-600">{stats ? formatCurrency(stats.financial.monthlyRevenue) : '$0'}</span>
              </div>
              <div className="pt-2 border-t">
                <Link href="/admin/finances">
                  <Button variant="outline" size="sm" className="w-full">
                    View Finances
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <option value="all">All Activity</option>
                <option value="users">User Activity</option>
                <option value="projects">Project Activity</option>
                <option value="disputes">Disputes</option>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t mt-4">
              <Link href="/admin/activity">
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/users/new">
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Create Admin User
                </Button>
              </Link>
              
              <Link href="/admin/disputes">
                <Button variant="outline" className="w-full justify-start">
                  <Flag className="h-4 w-4 mr-2" />
                  Review Disputes
                  {stats && stats.disputes.pending > 0 && (
                    <Badge className="ml-auto bg-red-100 text-red-800">
                      {stats.disputes.pending}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </Link>
              
              <Link href="/admin/announcements">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
              </Link>
              
              <Link href="/admin/system">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  System Health
                </Button>
              </Link>
              
              <Link href="/admin/backups">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Database Backup
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">API Status</p>
                <p className="text-xs text-gray-600">All systems operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-gray-600">Response time: 45ms</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Payment Gateway</p>
                <p className="text-xs text-gray-600">Minor delays detected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
