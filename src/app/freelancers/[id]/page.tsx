import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import { ArrowLeft, Mail } from "lucide-react";
import { FreelancerProfile } from "@/components/modules/freelancers/FreelancerProfile";
import { FreelancerPortfolio } from "@/components/modules/freelancers/FreelancerPortfolio";
import { FreelancerReviews } from "@/components/modules/freelancers/FreelancerReviews";

const mockFreelancer = {
  id: "1",
  name: "Amal Perera",
  title: "Full Stack Developer",
  hourlyRate: 4500,
  rating: 4.8,
  reviews: 27,
  skills: ["React", "Node.js", "MongoDB", "TypeScript"],
  location: "Colombo, Sri Lanka",
  about:
    "Experienced full stack developer with 5+ years of experience building web applications. Specialized in creating responsive, high-performance web apps using modern JavaScript frameworks.",
  imageUrl:
    "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?uid=R162230089&semt=ais_hybrid&w=740",
  education: [
    {
      degree: "BSc in Computer Science",
      institution: "University of Colombo",
      year: "2020",
    },
  ],
  experience: [
    {
      title: "Senior Developer",
      company: "Tech Solutions Lanka",
      period: "2020 - Present",
    },
    {
      title: "Junior Developer",
      company: "Digital Creations",
      period: "2018 - 2020",
    },
  ],
  portfolio: [
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Built a complete e-commerce solution with admin dashboard.",
      imageUrl:
        "https://img.freepik.com/free-vector/shopping-landing-page-template_23-2148117795.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    },
    {
      id: "2",
      title: "Booking System",
      description: "Developed a hotel booking system with payment integration.",
      imageUrl:
        "https://img.freepik.com/free-vector/hotel-booking-concept-illustration_114360-6497.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    },
  ],
  completedProjects: 35,
  completionRate: 98,
  memberSince: "2020-05-12",
  languages: ["English (Fluent)", "Sinhala (Native)"],
};

// Remove the "use client" directive
export default function FreelancerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const freelancer = mockFreelancer.id === params.id ? mockFreelancer : null;
  
  if (!freelancer) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/freelancers">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
            Back to Freelancers
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <FreelancerProfile freelancer={freelancer} />
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Button icon={<Mail size={16} />} className="w-full sm:w-auto">
            Contact Freelancer
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FreelancerPortfolio portfolio={freelancer.portfolio} />
        </div>
        <div>
          <FreelancerReviews freelancerId={freelancer.id} />
        </div>
      </div>
    </div>
  );
}