import React from "react";
import Badge from "@/components/ui/Badge";
import { Star, MapPin, Calendar, CheckCircle } from "lucide-react";

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
}

interface FreelancerData {
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
  education: Education[];
  experience: Experience[];
  completedProjects: number;
  completionRate: number;
  memberSince: string;
  languages: string[];
}

interface FreelancerProfileProps {
  freelancer: FreelancerData;
}

export const FreelancerProfile: React.FC<FreelancerProfileProps> = ({
  freelancer,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img
            src={freelancer.imageUrl}
            alt={freelancer.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="text-2xl font-bold">{freelancer.name}</h1>
              <p className="text-lg text-gray-600 mb-2">{freelancer.title}</p>

              <div className="flex items-center mb-2">
                <MapPin size={16} className="text-gray-500 mr-1" />
                <span className="text-gray-600 text-sm">
                  {freelancer.location}
                </span>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex items-center mr-3">
                  <Star
                    size={16}
                    className="text-yellow-400 fill-yellow-400 mr-1"
                  />
                  <span>{freelancer.rating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  ({freelancer.reviews} reviews)
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-4 md:mt-0">
              <div className="text-lg font-semibold mb-1">
                Rs. {freelancer.hourlyRate.toLocaleString()} / hour
              </div>
              <div className="flex items-center mb-1">
                <CheckCircle size={16} className="text-green-500 mr-1" />
                <span className="text-sm">
                  {freelancer.completedProjects} projects completed
                </span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">
                  Member since {formatDate(freelancer.memberSince)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill) => (
                <Badge key={skill} variant="primary" rounded>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <p className="text-gray-700 whitespace-pre-line">{freelancer.about}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Education</h2>
          {freelancer.education.map((edu, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="font-medium">{edu.degree}</div>
              <div className="text-sm text-gray-600">{edu.institution}</div>
              <div className="text-sm text-gray-500">{edu.year}</div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Experience</h2>
          {freelancer.experience.map((exp, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="font-medium">{exp.title}</div>
              <div className="text-sm text-gray-600">{exp.company}</div>
              <div className="text-sm text-gray-500">{exp.period}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
