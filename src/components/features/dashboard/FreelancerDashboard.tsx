'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  DollarSign, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  MessageCircle, 
  Eye,
  Award,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { projectApi, type Project } from '@/lib/api/projects';
import { proposalApi, type Proposal } from '@/lib/api/proposals';
import { contractApi, type Contract } from '@/lib/api/contracts';
import { analyticsApi, type UserAnalytics } from '@/lib/api/analytics';

interface FreelancerProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  title?: string;
  hourlyRate?: number;
  skills: string[];
  rating: number;
  reviewCount: number;
  completedProjects: number;
  totalEarnings: number;
  responseTime: number;
  availability: string;
}
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import Image from 'next/image';

interface FreelancerDashboardProps {
  userId: string;
}

export default function FreelancerDashboard({ userId }: FreelancerDashboardProps) {
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
  const [activeContracts, setActiveContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        profileResponse,
        analyticsResponse,
        projectsResponse,
        proposalsResponse,
        contractsResponse
      ] = await Promise.all([
        authApi.getProfile(), // Get current user profile
        analyticsApi.getUserAnalytics(),
        projectApi.getProjects({ limit: 5, status: 'open' }),
        proposalApi.getMyProposals({ limit: 5, status: 'pending' }),
        contractApi.getMyContracts({ limit: 5, status: 'active' })
      ]);

      setProfile(profileResponse.data);
      setAnalytics(analyticsResponse.data);
      setRecentProjects(projectsResponse.projects);
      setActiveProposals(proposalsResponse.proposals);
      setActiveContracts(contractsResponse.contracts);
      
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
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

  const getCompletionRate = () => {
    if (!analytics || analytics.projectsCompleted === 0) return 0;
    return Math.round((analytics.projectsCompleted / (analytics.projectsCompleted + 1)) * 100);
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {profile?.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt={`${profile.firstName} ${profile.lastName}`}
                width={64}
                height={64}
                className="rounded-full border-4 border-white"
              />
            ) : (
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {profile?.firstName}!
              </h1>
              <p className="text-blue-100 mt-1">
                Here's what's happening with your freelance business today
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-xl font-bold">
                {profile?.rating.toFixed(1) || '0.0'}
              </span>
            </div>
            <p className="text-blue-100 text-sm">
              {profile?.reviewCount || 0} reviews
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCompletionRate()}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.responseRate || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/projects">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Browse Projects
              </Button>
            </Link>
            <Link href="/proposals">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                My Proposals
              </Button>
            </Link>
            <Link href="/contracts">
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" />
                Active Contracts
              </Button>
            </Link>
            <Link href="/profile/edit">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Latest Projects</h3>
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No recent projects</p>
                <Link href="/projects">
                  <Button className="mt-2">Browse Projects</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/projects/${project._id}`}>
                        <h4 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2">
                          {project.title}
                        </h4>
                      </Link>
                      <Badge className="ml-2">
                        {project.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 font-medium">
                        ${project.budget.min} - ${project.budget.max}
                      </span>
                      <span className="text-gray-500">
                        {project.proposalCount || 0} proposals
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Proposals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Active Proposals</h3>
              <Link href="/proposals">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activeProposals.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No active proposals</p>
                <Link href="/projects">
                  <Button className="mt-2">Submit a Proposal</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeProposals.map((proposal) => (
                  <div key={proposal._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/proposals/${proposal._id}`}>
                        <h4 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2">
                          {proposal.project?.title || 'Project'}
                        </h4>
                      </Link>
                      <Badge className={`ml-2 ${
                        proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {proposal.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 font-medium">
                        {formatCurrency(proposal.bidAmount)}
                      </span>
                      <span className="text-gray-500">
                        {proposal.deliveryTime} days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Contracts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Contracts</h3>
            <Link href="/contracts">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {activeContracts.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No active contracts</p>
              <p className="text-sm text-gray-500 mt-1">
                Complete proposals to get contracts
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Deadline</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeContracts.map((contract) => (
                    <tr key={contract._id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <Link href={`/contracts/${contract._id}`}>
                          <span className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                            {contract.title}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {contract.client?.profilePicture ? (
                            <Image
                              src={contract.client.profilePicture}
                              alt={`${contract.client.firstName} ${contract.client.lastName}`}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                          )}
                          <span className="text-sm text-gray-900">
                            {contract.client?.firstName} {contract.client?.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-green-600">
                          {formatCurrency(contract.totalAmount)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {new Date(contract.expectedEndDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${
                          contract.status === 'active' ? 'bg-green-100 text-green-800' :
                          contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contract.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/contracts/${contract._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Performance */}
      {analytics?.skillsPerformance && analytics.skillsPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Skills Performance</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.skillsPerformance.slice(0, 6).map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{skill.skill}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Projects</span>
                      <span className="font-medium">{skill.projects}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="font-medium">{skill.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Earnings</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(skill.earnings)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
