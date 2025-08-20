'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Plus, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Users, 
  MessageCircle, 
  Star,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { projectApi, type Project } from '@/lib/api/projects';
import { proposalApi, type Proposal } from '@/lib/api/proposals';
import { contractApi, type Contract } from '@/lib/api/contracts';
import { analyticsApi, type UserAnalytics } from '@/lib/api/analytics';

interface ClientProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  companyName?: string;
  companySize?: string;
  industry?: string;
  projectsPosted: number;
  totalSpent: number;
  rating: number;
  reviewCount: number;
}
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import Image from 'next/image';

interface ClientDashboardProps {
  userId: string;
}

export default function ClientDashboard({ userId }: ClientDashboardProps) {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [recentProposals, setRecentProposals] = useState<Proposal[]>([]);
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
        projectApi.getMyProjects({ limit: 5 }),
        proposalApi.getProjectProposals('', { limit: 10 }), // Will need to aggregate from projects
        contractApi.getMyContracts({ limit: 5, status: 'active' })
      ]);

      setProfile(profileResponse.data);
      setAnalytics(analyticsResponse.data);
      setMyProjects(projectsResponse.projects);
      setRecentProposals(proposalsResponse.proposals);
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

  const getProjectStats = () => {
    const total = myProjects.length;
    const completed = myProjects.filter(p => p.status === 'completed').length;
    const active = myProjects.filter(p => p.status === 'in_progress').length;
    const pending = myProjects.filter(p => p.status === 'open').length;
    
    return { total, completed, active, pending };
  };

  const getTotalSpent = () => {
    return activeContracts.reduce((total, contract) => total + contract.totalAmount, 0);
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

  const projectStats = getProjectStats();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-6">
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
              <p className="text-green-100 mt-1">
                Manage your projects and find the perfect freelancers
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Link href="/projects/create">
              <Button className="bg-white text-green-600 hover:bg-green-50">
                <Plus className="h-4 w-4 mr-2" />
                Post New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projectStats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projectStats.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projectStats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(getTotalSpent())}
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
            <Link href="/projects/create">
              <Button className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Post New Project
              </Button>
            </Link>
            <Link href="/freelancers">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Browse Freelancers
              </Button>
            </Link>
            <Link href="/contracts">
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" />
                Manage Contracts
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">My Projects</h3>
              <Link href="/projects/my-projects">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {myProjects.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No projects yet</p>
                <Link href="/projects/create">
                  <Button className="mt-2">Post Your First Project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myProjects.map((project) => (
                  <div key={project._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/projects/${project._id}`}>
                        <h4 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2">
                          {project.title}
                        </h4>
                      </Link>
                      <Badge className={`ml-2 ${
                        project.status === 'open' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
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
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">
                          {project.proposalCount || 0} proposals
                        </span>
                        <span className="text-gray-500">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Proposals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Proposals</h3>
              <Link href="/proposals">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentProposals.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No proposals received</p>
                <p className="text-sm text-gray-500 mt-1">
                  Post a project to start receiving proposals
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProposals.slice(0, 5).map((proposal) => (
                  <div key={proposal._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {proposal.freelancer?.profilePicture ? (
                        <Image
                          src={proposal.freelancer.profilePicture}
                          alt={`${proposal.freelancer.firstName} ${proposal.freelancer.lastName}`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {proposal.freelancer?.firstName} {proposal.freelancer?.lastName}
                            </h4>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="h-3 w-3 text-yellow-400" />
                              <span className="text-sm text-gray-600">
                                {proposal.freelancer?.rating.toFixed(1)} ({proposal.freelancer?.completedProjects} projects)
                              </span>
                            </div>
                          </div>
                          <Badge className={`${
                            proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {proposal.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {proposal.coverLetter}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-600 font-medium">
                            {formatCurrency(proposal.bidAmount)}
                          </span>
                          <span className="text-gray-500">
                            {proposal.deliveryTime} days delivery
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Link href={`/proposals/${proposal._id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      {proposal.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                            Decline
                          </Button>
                        </>
                      )}
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
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No active contracts</p>
              <p className="text-sm text-gray-500 mt-1">
                Accept proposals to create contracts
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Freelancer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
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
                          {contract.freelancer?.profilePicture ? (
                            <Image
                              src={contract.freelancer.profilePicture}
                              alt={`${contract.freelancer.firstName} ${contract.freelancer.lastName}`}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                          )}
                          <span className="text-sm text-gray-900">
                            {contract.freelancer?.firstName} {contract.freelancer?.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-green-600">
                          {formatCurrency(contract.totalAmount)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${50}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {50}%
                          </span>
                        </div>
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
                        <div className="flex space-x-2">
                          <Link href={`/contracts/${contract._id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/messages?contract=${contract._id}`}>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                          </Link>
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

      {/* Project Performance */}
      {analytics && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Project Performance</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {((projectStats.completed / projectStats.total) * 100 || 0).toFixed(0)}%
                </div>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analytics.responseRate || 0}%
                </div>
                <p className="text-sm text-gray-600">Response Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analytics.totalEarnings ? formatCurrency(analytics.totalEarnings / 1000) : '$0'}
                </div>
                <p className="text-sm text-gray-600">Avg. Project Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
