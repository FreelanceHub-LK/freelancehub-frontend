'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Briefcase, 
  Clock,
  Star,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { analyticsApi, type UserAnalytics } from '@/lib/api/analytics';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';

interface AnalyticsDashboardProps {
  userRole?: 'freelancer' | 'client' | 'admin';
}

export default function AnalyticsDashboard({ userRole = 'freelancer' }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [dateRange, setDateRange] = useState<string>('30d');
  const [metric, setMetric] = useState<string>('all');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, metric]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch user analytics only
      const userAnalyticsResponse = await analyticsApi.getUserAnalytics();
      setAnalytics(userAnalyticsResponse.data);
      
      // Mock platform stats for now
      setPlatformStats({
        totalUsers: 1250,
        totalProjects: 3400,
        totalVolume: 850000,
        successRate: 87.5
      });
      
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (growth < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
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
        <Button onClick={fetchAnalytics} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Mock growth values since they're not in UserAnalytics
  const earningsGrowth = 12.5; // Mock value
  const projectsGrowth = 8.3; // Mock value
  const ratingGrowth = 2.1; // Mock value
  const responseTimeGrowth = -5.2; // Mock value (negative is good for response time)

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your performance and insights</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="365d">Last year</option>
          </Select>
          
          <Select value={metric} onValueChange={setMetric}>
            <option value="all">All Metrics</option>
            <option value="earnings">Earnings</option>
            <option value="projects">Projects</option>
            <option value="performance">Performance</option>
          </Select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics ? formatCurrency(analytics.totalEarnings) : '$0'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getGrowthIcon(earningsGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(earningsGrowth)}`}>
                  {formatPercentage(Math.abs(earningsGrowth))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Projects Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.projectsCompleted || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getGrowthIcon(projectsGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(projectsGrowth)}`}>
                  {formatPercentage(Math.abs(projectsGrowth))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.averageRating?.toFixed(1) || '0.0'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getGrowthIcon(ratingGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(ratingGrowth)}`}>
                  {formatPercentage(Math.abs(ratingGrowth))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.responseRate || 0}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getGrowthIcon(responseTimeGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(responseTimeGrowth)}`}>
                  {formatPercentage(Math.abs(responseTimeGrowth))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Earnings Trend</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Earnings chart would render here</p>
                <p className="text-sm text-gray-500">Integration with chart library needed</p>
              </div>
            </div>
            {analytics?.earningsHistory && analytics.earningsHistory.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(analytics.earningsHistory[analytics.earningsHistory.length - 1]?.earnings || 0)}
                  </p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(analytics.earningsHistory[analytics.earningsHistory.length - 2]?.earnings || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Last Month</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(analytics.totalEarnings / Math.max(analytics.earningsHistory.length, 1))}
                  </p>
                  <p className="text-sm text-gray-600">Avg Monthly</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Distribution</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Project distribution chart</p>
                <p className="text-sm text-gray-500">Integration with chart library needed</p>
              </div>
            </div>
            {analytics?.skillsPerformance && analytics.skillsPerformance.length > 0 && (
              <div className="mt-4 space-y-3">
                {analytics.skillsPerformance.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-600' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-blue-400' :
                        index === 3 ? 'bg-blue-300' : 'bg-blue-200'
                      }`}></div>
                      <span className="text-sm text-gray-700">{item.skill}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">{item.projects}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({((item.projects / analytics.projectsCompleted) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skills Performance */}
      {analytics?.skillsPerformance && analytics.skillsPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Skills Performance</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Skill</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Projects</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Earnings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.skillsPerformance.map((skill, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <Badge>{skill.skill}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-900">{skill.projects}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-sm text-gray-900">{skill.averageRating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(skill.earnings)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          {getGrowthIcon((index + 1) * 3.2)} {/* Mock growth based on index */}
                          <span className={`text-sm ${getGrowthColor((index + 1) * 3.2)}`}>
                            {formatPercentage((index + 1) * 3.2)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Goals */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Performance Goals</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Monthly Earnings Target</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(analytics?.totalEarnings || 0)} / {formatCurrency(5000)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(((analytics?.totalEarnings || 0) / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Projects This Month</span>
                  <span className="text-sm font-medium text-gray-900">
                    {analytics?.projectsCompleted || 0} / 10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(((analytics?.projectsCompleted || 0) / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Response Rate Goal</span>
                  <span className="text-sm font-medium text-gray-900">
                    {analytics?.responseRate || 0}% / 95%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(((analytics?.responseRate || 0) / 95) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Insights</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Top Performing Skill</p>
                  <p className="text-sm text-gray-600">
                    {analytics?.skillsPerformance?.[0]?.skill || 'No data'} with highest earnings
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Success Rate</p>
                  <p className="text-sm text-gray-600">
                    {85}% of proposals are accepted
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Average Response Time</p>
                  <p className="text-sm text-gray-600">
                    {Math.round((24 * 60) / 60)} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Repeat Clients</p>
                  <p className="text-sm text-gray-600">
                    {75}% of clients hire you again
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance (Admin only) */}
      {userRole === 'admin' && platformStats && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Platform Overview</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{platformStats.totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{platformStats.totalProjects}</p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(platformStats.totalVolume)}</p>
                <p className="text-sm text-gray-600">Total Volume</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(platformStats.successRate)}</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
