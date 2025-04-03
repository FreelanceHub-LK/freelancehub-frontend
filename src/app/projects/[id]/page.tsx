"use client";
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectDetails } from "@/components/modules/projects/ProjectDetails";

// Mock data - in real app, this would come from API
const mockProject: {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  postedDate: string;
  category: string;
  skills: string[];
  status: "open" | "in-progress" | "completed" | "canceled";
  client: {
    name: string;
    location: string;
    joinedDate: string;
    projectsPosted: number;
  };
} = {
  id: "1",
  title: "E-commerce Website Development",
  description:
    "Looking for a full-stack developer to build an e-commerce website for a local clothing brand. The website should have product listings, shopping cart, payment integration, and admin dashboard.\n\nRequirements:\n- Responsive design\n- Product catalog with categories and filters\n- User authentication\n- Shopping cart functionality\n- Payment gateway integration (PayHere)\n- Order management\n- Admin dashboard for inventory and order management",
  budget: 150000,
  deadline: "2025-06-30",
  postedDate: "2025-04-01",
  category: "Web Development",
  skills: ["React", "Node.js", "MongoDB", "Payment Gateway"],
  status: "open",
  client: {
    name: "ABC Clothing",
    location: "Colombo, Sri Lanka",
    joinedDate: "2024-07-15",
    projectsPosted: 12,
  },
};

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = mockProject.id === params.id ? mockProject : null;

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ProjectDetails project={project} />
      </div>
    </div>
  );
}
