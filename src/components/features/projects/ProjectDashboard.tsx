'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Plus, Clock, DollarSign, Users, Briefcase } from 'lucide-react';
import { projectApi, type Project, type ProjectFilters } from '@/lib/api/projects';
import { categoryApi, type Category } from '@/lib/api/categories';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectDashboardProps {
  userRole: 'client' | 'freelancer' | 'admin';
  userId?: string;
}

export default function ProjectDashboard({ userRole, userId }: ProjectDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0
  });

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, currentPage]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const filters: ProjectFilters = {
        page: currentPage,
        limit: 12,
        sortBy: sortBy as any,
        sortOrder: 'desc'
      };

      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedStatus) filters.status = selectedStatus;

      const response = userRole === 'client' 
        ? await projectApi.getMyProjects(filters)
        : await projectApi.getProjects(filters);

      setProjects(response.projects);
      setTotalPages(response.totalPages);
      
      // Calculate stats
      const statusCounts = response.projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        total: response.total,
        open: statusCounts.open || 0,
        inProgress: statusCounts.in_progress || 0,
        completed: statusCounts.completed || 0
      });

    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getMainCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const formatBudget = (budget: Project['budget']) => {
    return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border border-gray-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link href={`/projects/${project._id}`}>
              <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                {project.title}
              </h3>
            </Link>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${statusColors[project.status]}`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          {project.isUrgent && (
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              Urgent
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3">
          {project.description}
        </p>

        {/* Budget and Deadline */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            {formatBudget(project.budget)}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(project.deadline)}
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {project.skillsRequired.slice(0, 3).map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
          {project.skillsRequired.length > 3 && (
            <span className="text-gray-500 text-xs">+{project.skillsRequired.length - 3} more</span>
          )}
        </div>

        {/* Client Info and Proposals */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {project.client?.profilePicture ? (
              <Image
                src={project.client.profilePicture}
                alt={`${project.client.firstName} ${project.client.lastName}`}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {project.client?.firstName?.[0] || 'C'}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">
              {project.client?.firstName} {project.client?.lastName}
            </span>
          </div>
          {userRole === 'freelancer' && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              {project.proposalCount || 0} proposals
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/projects/${project._id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {userRole === 'freelancer' && project.status === 'open' && (
            <Link href={`/projects/${project._id}/propose`} className="flex-1">
              <Button className="w-full">
                Submit Proposal
              </Button>
            </Link>
          )}
          {userRole === 'client' && (
            <Link href={`/projects/${project._id}/proposals`} className="flex-1">
              <Button className="w-full">
                View Proposals
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );

  const ProjectListItem = ({ project }: { project: Project }) => (
    <Card className="p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <Link href={`/projects/${project._id}`}>
              <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate">
                {project.title}
              </h3>
            </Link>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
            {project.isUrgent && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                Urgent
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 truncate">{project.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {formatBudget(project.budget)}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDate(project.deadline)}
            </div>
            {userRole === 'freelancer' && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {project.proposalCount || 0} proposals
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/projects/${project._id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
          {userRole === 'freelancer' && project.status === 'open' && (
            <Link href={`/projects/${project._id}/propose`}>
              <Button size="sm">
                Propose
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userRole === 'client' ? 'My Projects' : 'Browse Projects'}
          </h1>
          <p className="text-gray-600 mt-1">
            {userRole === 'client' 
              ? 'Manage your posted projects and track progress'
              : 'Discover amazing projects and submit proposals'
            }
          </p>
        </div>
        
        {userRole === 'client' && (
          <Link href="/projects/create">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Post Project</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-xl font-semibold text-gray-900">{stats.open}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-xl font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              placeholder="All Categories"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
            
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              placeholder="All Statuses"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <option value="createdAt">Latest</option>
              <option value="budget">Budget</option>
              <option value="deadline">Deadline</option>
            </Select>
            
            <div className="flex items-center space-x-1 border border-gray-300 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Projects Grid/List */}
      {error ? (
        <Card className="p-8 text-center">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={fetchProjects}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </Card>
      ) : projects.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Briefcase className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {userRole === 'client' 
              ? "You haven't posted any projects yet."
              : "No projects match your current filters."
            }
          </p>
          {userRole === 'client' && (
            <Link href="/projects/create">
              <Button>Post Your First Project</Button>
            </Link>
          )}
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectListItem key={project._id} project={project} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
