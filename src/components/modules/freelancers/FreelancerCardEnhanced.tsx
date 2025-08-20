"use client";
import React from "react";
import Link from "next/link";
import Badge from "@/components/ui/Button";
import { Star, MapPin, Clock, CheckCircle, Calendar } from "lucide-react";

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
  isAvailable?: boolean;
  memberSince?: string;
  responseTime?: string;
  languages?: string[];
  isVerified?: boolean;
  isOnline?: boolean;
}

export const FreelancerCardEnhanced: React.FC<FreelancerCardProps> = ({
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
  isAvailable = true,
  memberSince,
  responseTime,
  languages = [],
  isVerified = false,
  isOnline = false,
}) => {
  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row">
          {/* Profile Image and Status */}
          <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6">
            <div className="relative">
              <img
                src={imageUrl}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/api/placeholder/80/80";
                }}
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
              {/* Left Column - Basic Info */}
              <div className="flex-grow mb-4 lg:mb-0">
                <div className="flex items-center mb-2">
                  <Link
                    href={`/freelancers/${id}`}
                    className="text-xl font-semibold hover:text-blue-600 transition-colors"
                  >
                    {name}
                  </Link>
                  {isVerified && (
                    <CheckCircle className="ml-2 text-blue-500" size={16} />
                  )}
                </div>
                
                <p className="text-gray-600 mb-2 font-medium">{title}</p>

                <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                    <span className="ml-1">({reviews} reviews)</span>
                  </div>

                  {memberSince && (
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>Member since {formatMemberSince(memberSince)}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {about}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {skills.slice(0, 5).map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {skills.length > 5 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{skills.length - 5} more
                    </span>
                  )}
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle size={12} className="mr-1 text-green-500" />
                    <span>{completedProjects} projects completed</span>
                  </div>
                  
                  {responseTime && (
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>Responds in {responseTime}</span>
                    </div>
                  )}

                  {languages.length > 0 && (
                    <div>
                      <span>Languages: {languages.slice(0, 2).join(', ')}</span>
                      {languages.length > 2 && <span> +{languages.length - 2}</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Pricing and Actions */}
              <div className="flex-shrink-0 lg:ml-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      Rs. {hourlyRate.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">per hour</div>
                    
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                      isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {isAvailable ? 'Available' : 'Busy'}
                    </div>

                    <div className="space-y-2">
                      <Link href={`/freelancers/${id}`} className="block">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                          View Profile
                        </button>
                      </Link>
                      
                      <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
