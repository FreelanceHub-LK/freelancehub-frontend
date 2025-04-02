import React from 'react';
import { Calendar, Clock, DollarSign, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string[];
  status: 'open' | 'in-progress' | 'completed' | 'canceled';
  postedDate: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  budget,
  deadline,
  skills,
  status,
  postedDate,
}) => {
  const statusColors = {
    'open': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-purple-100 text-purple-800',
    'canceled': 'bg-red-100 text-red-800',
  };

  return (
    <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-4">
        <Link href={`/projects/${id}`} className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors">
          {title}
        </Link>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.replace('-', ' ')}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            +{skills.length - 3} more
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <DollarSign size={16} className="mr-1" />
          <span>LKR {budget.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="mr-1" />
          <span>Due: {new Date(deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="mr-1" />
          <span>Posted: {new Date(postedDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex justify-end mt-2">
        <Button variant="outline" size="sm">View Details</Button>
      </div>
    </div>
  );
};