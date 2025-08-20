"use client";
import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MessageCircle, 
  Briefcase, 
  DollarSign,
  Calendar,
  Star,
  Users,
  Clock,
  Award,
  Target
} from "lucide-react";

interface FreelancerAnalyticsProps {
  freelancerId: string;
}

interface AnalyticsData {
  profileViews: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  messages: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  proposals: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  earnings: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  avgRating: number;
  completedProjects: number;
  responseTime: string;
  successRate: number;
}

export const FreelancerAnalytics: React.FC<FreelancerAnalyticsProps> = ({
  freelancerId
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    profileViews: {
      current: 247,
      previous: 198,
      trend: 'up',
      percentage: 24.7
    },
    messages: {
      current: 18,
      previous: 23,
      trend: 'down',
      percentage: 21.7
    },
    proposals: {
      current: 12,
      previous: 8,
      trend: 'up',
      percentage: 50.0
    },
    earnings: {
      current: 3420,
      previous: 2890,
      trend: 'up',
      percentage: 18.3
    },
    avgRating: 4.8,
    completedProjects: 27,
    responseTime: '2 hours',
    successRate: 92
  };

  const StatCard = ({ 
    title, 
    current, 
    previous, 
    trend, 
    percentage, 
    icon: Icon, 
    color,
    format = 'number'
  }: {
    title: string;
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
    icon: React.ElementType;
    color: string;
    format?: 'number' | 'currency';
  }) => {
    const formatValue = (value: number) => {
      if (format === 'currency') {
        return `$${value.toLocaleString()}`;
      }
      return value.toLocaleString();
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
          <div className={`flex items-center space-x-1 ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{formatValue(current)}</h3>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-xs text-gray-500 mt-1">
            vs {formatValue(previous)} last period
          </p>
        </div>
      </div>
    );
  };

  const PerformanceMetric = ({ 
    label, 
    value, 
    icon: Icon, 
    color 
  }: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );

  const ViewsChart = () => {
    // Mock chart data
    const chartData = [
      { day: 'Mon', views: 35 },
      { day: 'Tue', views: 42 },
      { day: 'Wed', views: 28 },
      { day: 'Thu', views: 51 },
      { day: 'Fri', views: 39 },
      { day: 'Sat', views: 26 },
      { day: 'Sun', views: 26 }
    ];

    const maxViews = Math.max(...chartData.map(d => d.views));

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Views (Last 7 Days)</h3>
        <div className="flex items-end space-x-2 h-32">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(data.views / maxViews) * 100}%` }}
                title={`${data.views} views`}
              ></div>
              <span className="text-xs text-gray-600 mt-2">{data.day}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RecentActivity = () => {
    const activities = [
      {
        id: 1,
        type: 'profile_view',
        message: 'Your profile was viewed by TechCorp Inc.',
        time: '2 hours ago',
        icon: Eye,
        color: 'text-blue-600'
      },
      {
        id: 2,
        type: 'message',
        message: 'New message from Sarah Johnson',
        time: '4 hours ago',
        icon: MessageCircle,
        color: 'text-green-600'
      },
      {
        id: 3,
        type: 'proposal',
        message: 'You sent a proposal for "E-commerce Website"',
        time: '1 day ago',
        icon: Briefcase,
        color: 'text-purple-600'
      },
      {
        id: 4,
        type: 'review',
        message: 'You received a 5-star review from Michael Chen',
        time: '2 days ago',
        icon: Star,
        color: 'text-yellow-600'
      }
    ];

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                  <IconComponent size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TopSkills = () => {
    const skills = [
      { name: 'React', projects: 15, color: 'bg-blue-500' },
      { name: 'Node.js', projects: 12, color: 'bg-green-500' },
      { name: 'TypeScript', projects: 10, color: 'bg-purple-500' },
      { name: 'MongoDB', projects: 8, color: 'bg-yellow-500' },
      { name: 'AWS', projects: 6, color: 'bg-red-500' }
    ];

    const maxProjects = Math.max(...skills.map(s => s.projects));

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills by Projects</h3>
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-700">{skill.name}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${skill.color}`}
                  style={{ width: `${(skill.projects / maxProjects) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 w-8">{skill.projects}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your performance and growth</p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: '1y', label: '1 Year' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as any)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                timeRange === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Profile Views"
          current={analyticsData.profileViews.current}
          previous={analyticsData.profileViews.previous}
          trend={analyticsData.profileViews.trend}
          percentage={analyticsData.profileViews.percentage}
          icon={Eye}
          color="bg-blue-500"
        />
        <StatCard
          title="Messages Received"
          current={analyticsData.messages.current}
          previous={analyticsData.messages.previous}
          trend={analyticsData.messages.trend}
          percentage={analyticsData.messages.percentage}
          icon={MessageCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Proposals Sent"
          current={analyticsData.proposals.current}
          previous={analyticsData.proposals.previous}
          trend={analyticsData.proposals.trend}
          percentage={analyticsData.proposals.percentage}
          icon={Briefcase}
          color="bg-purple-500"
        />
        <StatCard
          title="Earnings"
          current={analyticsData.earnings.current}
          previous={analyticsData.earnings.previous}
          trend={analyticsData.earnings.trend}
          percentage={analyticsData.earnings.percentage}
          icon={DollarSign}
          color="bg-yellow-500"
          format="currency"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PerformanceMetric
          label="Average Rating"
          value={`${analyticsData.avgRating}/5.0`}
          icon={Star}
          color="bg-yellow-500"
        />
        <PerformanceMetric
          label="Completed Projects"
          value={analyticsData.completedProjects}
          icon={Award}
          color="bg-green-500"
        />
        <PerformanceMetric
          label="Response Time"
          value={analyticsData.responseTime}
          icon={Clock}
          color="bg-blue-500"
        />
        <PerformanceMetric
          label="Success Rate"
          value={`${analyticsData.successRate}%`}
          icon={Target}
          color="bg-purple-500"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ViewsChart />
          <TopSkills />
        </div>
        <div className="space-y-6">
          <RecentActivity />
          
          {/* Goals & Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals & Recommendations</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Increase Profile Views</h4>
                <p className="text-sm text-blue-700">
                  Update your skills and add portfolio items to improve visibility.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Maintain Response Time</h4>
                <p className="text-sm text-green-700">
                  Great job! Your 2-hour response time helps you win more projects.
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Send More Proposals</h4>
                <p className="text-sm text-purple-700">
                  Target: 20 proposals this month. You're 60% there!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
