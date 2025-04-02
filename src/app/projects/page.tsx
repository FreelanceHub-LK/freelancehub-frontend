"use client";
import React from 'react';
import { ProjectFilters } from '@/components/modules/projects/ProjectFilters';
import { ProjectCard } from '@/components/modules/projects/ProjectCard';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

// Mock data - in real app, this would come from API
const mockProjects: Array<{
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills: string[];
  status: "open" | "in-progress" | "completed" | "canceled";
  postedDate: string;
}> = [
  {
    id: '1',
    title: 'E-commerce Website Development',
    description: 'Looking for a full-stack developer to build an e-commerce website for a local clothing brand. The website should have product listings, shopping cart, payment integration, and admin dashboard.',
    budget: 150000,
    deadline: '2025-06-30',
    skills: ['React', 'Node.js', 'MongoDB', 'Payment Gateway'],
    status: "open" as "open",
    postedDate: '2025-04-01',
  },
  {
    id: '2',
    title: 'Social Media Marketing Campaign',
    description: 'Need an experienced marketer to run social media campaigns for our new product launch. Campaign includes content creation, scheduling, and performance analysis.',
    budget: 75000,
    deadline: '2025-05-15',
    skills: ['Social Media Marketing', 'Content Creation', 'Analytics'],
    status: 'open',
    postedDate: '2025-03-28',
  },
  // More projects...
];

export default function ProjectsPage() {
  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters);
    // In a real app, this would filter the projects or trigger an API call
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Browse Projects</h1>
        <Link href="/projects/create">
          <Button icon={<Plus size={16} />}>Post a Project</Button>
        </Link>
      </div>
      
      <ProjectFilters onApplyFilters={handleApplyFilters} />
      
      <div className="space-y-4">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}