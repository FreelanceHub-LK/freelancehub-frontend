import React from "react";
import Link from "next/link";
import Badge from "@/components/ui/Button";
import { Star, MapPin } from "lucide-react";

interface FreelancerCardProps {
  id: string;
  name: string;
  title: string;
  hourlyRate: number;
  rating: number;
  reviews: number;
  skills: string[];
  location: string;
  about: string;
  imageUrl: string;
  completedProjects: number;
}

export const FreelancerCard: React.FC<FreelancerCardProps> = ({
  id,
  name,
  title,
  hourlyRate,
  rating,
  reviews,
  skills,
  location,
  about,
  imageUrl,
  completedProjects,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200">
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4 flex justify-center md:justify-start">
          <img
            src={imageUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:justify-between mb-2">
            <div>
              <Link
                href={`/freelancers/${id}`}
                className="text-lg font-semibold hover:text-blue-600"
              >
                {name}
              </Link>
              <p className="text-gray-600">{title}</p>
            </div>
            <div className="text-right mt-2 md:mt-0">
              <div className="font-semibold text-lg">
                Rs. {hourlyRate.toLocaleString()}/hr
              </div>
              <div className="text-sm text-gray-500">
                {completedProjects} projects completed
              </div>
            </div>
          </div>

          <div className="flex items-center mb-2">
            <MapPin size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{location}</span>
            <div className="ml-4 flex items-center">
              <Star
                size={16}
                className="text-yellow-400 fill-yellow-400 mr-1"
              />
              <span>{rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-1">
                ({reviews} reviews)
              </span>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{about}</p>

          <div className="flex flex-wrap gap-1 mb-2">
            {skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" size="sm">
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <span className="text-sm text-gray-500 ml-1">
                +{skills.length - 4} more
              </span>
            )}
          </div>

          <div className="mt-3 flex justify-end">
            <Link
              href={`/freelancers/${id}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
