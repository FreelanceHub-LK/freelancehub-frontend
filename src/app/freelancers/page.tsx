"use client";
import React from "react";
import { FreelancerFilters } from "@/components/modules/freelancers/FreelancerFilters";
import { FreelancerCard } from "@/components/modules/freelancers/FreelancerCard";

const mockFreelancers = [
  {
    id: "1",
    name: "Amal Perera",
    title: "Full Stack Developer",
    hourlyRate: 4500,
    rating: 4.8,
    reviews: 27,
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    location: "Colombo, Sri Lanka",
    about:
      "Experienced full stack developer with 5+ years of experience building web applications.",
    imageUrl:
      "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    completedProjects: 35,
  },
  {
    id: "2",
    name: "Dinesh Gunawardena",
    title: "UI/UX Designer",
    hourlyRate: 3800,
    rating: 4.7,
    reviews: 18,
    skills: ["UI Design", "UX Research", "Figma", "Adobe XD"],
    location: "Kandy, Sri Lanka",
    about:
      "Creative designer specializing in user interfaces and experiences for web and mobile applications.",
    imageUrl:
      "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    completedProjects: 22,
  },
  {
    id: "3",
    name: "Nimal Rajapaksha",
    title: "Digital Marketing Specialist",
    hourlyRate: 3000,
    rating: 4.5,
    reviews: 15,
    skills: ["SEO", "Content Marketing", "Social Media"],
    location: "Galle, Sri Lanka",
    about:
      "Expert in digital marketing strategies to boost online presence and engagement.",
    imageUrl:
      "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    completedProjects: 10,
  },
  {
    id: "4",
    name: "Saman Kumara",
    title: "Data Analyst",
    hourlyRate: 4000,
    rating: 4.6,
    reviews: 20,
    skills: ["Data Analysis", "Python", "SQL"],
    location: "Negombo, Sri Lanka",
    about:
      "Skilled in data analysis and visualization to drive business insights.",
    imageUrl:
      "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    completedProjects: 15,
  },
  {
    id: "5",
    name: "Kamal Fernando",
    title: "Mobile App Developer",
    hourlyRate: 5000,
    rating: 4.9,
    reviews: 30,
    skills: ["React Native", "Flutter", "iOS", "Android"],
    location: "Colombo, Sri Lanka",
    about:
      "Experienced mobile app developer with a passion for creating user-friendly applications.",
    imageUrl:
      "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    completedProjects: 40,
  },
];

export default function FreelancersPage() {
  const handleApplyFilters = (filters: any) => {
    console.log("Applied filters:", filters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Find Freelancers</h1>
        <p className="text-gray-600">
          Discover talented professionals for your projects
        </p>
      </div>

      <FreelancerFilters onApplyFilters={handleApplyFilters} />

      <div className="space-y-4 mt-6">
        {mockFreelancers.map((freelancer) => (
          <FreelancerCard key={freelancer.id} {...freelancer} />
        ))}
      </div>
    </div>
  );
}
