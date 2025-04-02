import React from 'react';
import { Calendar, DollarSign, Clock, User, MapPin, Briefcase } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ProjectDetailsProps {
  project: {
    id: string;
    title: string;
    description: string;
    budget: number;
    deadline: string;
    postedDate: string;
    category: string;
    skills: string[];
    status: 'open' | 'in-progress' | 'completed' | 'canceled';
    client: {
      name: string;
      location: string;
      joinedDate: string;
      projectsPosted: number;
    };
  };
  onSubmitProposal?: () => void;
  isClient?: boolean;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onSubmitProposal,
  isClient = false,
}) => {
  const statusColors = {
    'open': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-purple-100 text-purple-800',
    'canceled': 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-semibold text-gray-800">{project.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]}`}>
            {project.status.replace('-', ' ')}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>Posted on {new Date(project.postedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={16} className="mr-1" />
            <span>Budget: LKR {project.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-lg font-medium mb-3">Project Description</h2>
        <div className="text-gray-700 whitespace-pre-line mb-6">{project.description}</div>
        
        <h2 className="text-lg font-medium mb-3">Required Skills</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.skills.map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-medium mb-2">About the Client</h2>
          <div className="flex items-center mb-2">
            <User size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700">{project.client.name}</span>
          </div>
          <div className="flex items-center mb-2">
            <MapPin size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700">{project.client.location}</span>
          </div>
          <div className="flex items-center mb-2">
            <Clock size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700">Member since {new Date(project.client.joinedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Briefcase size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700">{project.client.projectsPosted} projects posted</span>
          </div>
        </div>
        
        {!isClient && project.status === 'open' && (
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={onSubmitProposal}
              className="px-8"
            >
              Submit a Proposal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};