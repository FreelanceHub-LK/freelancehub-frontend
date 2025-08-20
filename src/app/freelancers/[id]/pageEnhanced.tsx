"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Star, Calendar, CheckCircle, Clock, MessageCircle, Heart, Share2, Flag } from "lucide-react";
import { FreelancerProfile } from "@/components/modules/freelancers/FreelancerProfile";
import { FreelancerPortfolio } from "@/components/modules/freelancers/FreelancerPortfolio";
import { FreelancerReviews } from "@/components/modules/freelancers/FreelancerReviews";
import { useFreelancer, useFreelancerReviews, useSimilarFreelancers } from "@/hooks/useFreelancers";
import { FreelancerCardEnhanced } from "@/components/modules/freelancers/FreelancerCardEnhanced";
import { Loader2 } from "lucide-react";

export default function FreelancerDetailPageEnhanced() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');
  const [showContactForm, setShowContactForm] = useState(false);

  if (!params?.id) {
    notFound();
  }

  const id = String(params.id);
  const { freelancer, loading, error } = useFreelancer(id);
  const { reviews, stats: reviewStats, loading: reviewsLoading } = useFreelancerReviews(id);
  const { freelancers: similarFreelancers, loading: similarLoading } = useSimilarFreelancers(id, 3);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin mr-2" size={32} />
          <span className="text-lg">Loading freelancer profile...</span>
        </div>
      </div>
    );
  }

  if (error || !freelancer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Freelancer Not Found</h1>
          <p className="text-gray-600 mb-4">The freelancer profile you're looking for doesn't exist.</p>
          <Link href="/freelancers">
            <Button>Back to Freelancers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const calculateResponseTime = () => {
    // Mock calculation - in real app, this would come from backend
    return "within 1 hour";
  };

  const mockPortfolio = [
    {
      id: "1",
      title: "E-commerce Website",
      description: "Built a complete e-commerce platform with payment integration",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      technologies: ["React", "Node.js", "MongoDB"],
      projectUrl: "#"
    },
    {
      id: "2", 
      title: "Mobile App Design",
      description: "Designed user interface for a food delivery mobile application",
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
      technologies: ["Figma", "Sketch", "Principle"],
      projectUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/freelancers">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
              Back to Freelancers
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Profile Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row">
              {/* Profile Image and Basic Info */}
              <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
                <div className="relative">
                  <img
                    src={freelancer.profilePicture || "/api/placeholder/120/120"}
                    alt={`${freelancer.firstName} ${freelancer.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-grow">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                  <div className="mb-6 lg:mb-0">
                    <div className="flex items-center mb-2">
                      <h1 className="text-3xl font-bold mr-3">
                        {freelancer.firstName} {freelancer.lastName}
                      </h1>
                      <CheckCircle className="text-blue-500" size={24} />
                    </div>
                    
                    <p className="text-xl text-gray-600 mb-4">{freelancer.bio || "Professional Freelancer"}</p>

                    <div className="flex flex-wrap items-center gap-6 mb-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        <span>{freelancer.address || "Location not specified"}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 fill-yellow-400 mr-2" />
                        <span className="font-semibold">{freelancer.rating.toFixed(1)}</span>
                        <span className="ml-1">({freelancer.reviewCount} reviews)</span>
                      </div>

                      <div className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span>{freelancer.completedProjects} projects completed</span>
                      </div>

                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        <span>Member since {formatDate(freelancer.createdAt.toString())}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">SKILLS</h3>
                      <div className="flex flex-wrap gap-2">
                        {(freelancer.skills || []).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 p-4 rounded-lg">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{freelancer.completedProjects}</div>
                        <div className="text-xs text-gray-600">Projects</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{calculateResponseTime()}</div>
                        <div className="text-xs text-gray-600">Response Time</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {freelancer.isAvailable ? 'Available' : 'Busy'}
                        </div>
                        <div className="text-xs text-gray-600">Status</div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        Rs. {freelancer.hourlyRate?.toLocaleString() || "N/A"}
                      </div>
                      <div className="text-gray-600">per hour</div>
                    </div>

                    <div className={`inline-flex items-center justify-center w-full px-3 py-2 rounded-full text-sm font-medium mb-6 ${
                      freelancer.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        freelancer.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {freelancer.isAvailable ? 'Available Now' : 'Currently Busy'}
                    </div>

                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        icon={<MessageCircle size={16} />}
                        onClick={() => setShowContactForm(true)}
                      >
                        Contact Freelancer
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        icon={<Mail size={16} />}
                      >
                        Send Message
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-blue-200">
                      <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                        <Heart size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <Share2 size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-yellow-500 transition-colors">
                        <Flag size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview', count: null },
                { id: 'portfolio', label: 'Portfolio', count: mockPortfolio.length },
                { id: 'reviews', label: 'Reviews', count: freelancer.reviewCount }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {freelancer.bio || "This freelancer hasn't provided a detailed description yet."}
                  </p>
                </div>

                {freelancer.education && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Education</h2>
                    <p className="text-gray-700">{freelancer.education}</p>
                  </div>
                )}

                {(freelancer.certifications && freelancer.certifications.length > 0) && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Certifications</h2>
                    <div className="space-y-2">
                      {freelancer.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="text-green-500 mr-2" size={16} />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <FreelancerPortfolio portfolio={mockPortfolio} />
            )}

            {activeTab === 'reviews' && (
              <FreelancerReviews freelancerId={id} />
            )}
          </div>
        </div>

        {/* Similar Freelancers */}
        {!similarLoading && similarFreelancers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Similar Freelancers</h2>
            <div className="space-y-6">
              {similarFreelancers.map((similar) => (
                <FreelancerCardEnhanced
                  key={similar._id}
                  id={similar._id}
                  name={`${similar.firstName} ${similar.lastName}`}
                  title={similar.bio || "Freelancer"}
                  hourlyRate={similar.hourlyRate || 0}
                  rating={similar.rating}
                  reviews={similar.reviewCount}
                  skills={similar.skills || []}
                  location={similar.address || "Location not specified"}
                  about={similar.bio || "No description available"}
                  imageUrl={similar.profilePicture || "/api/placeholder/80/80"}
                  completedProjects={similar.completedProjects || 0}
                  isAvailable={similar.isAvailable}
                  memberSince={formatDate(similar.createdAt.toString())}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Contact {freelancer.firstName}</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Project inquiry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Describe your project..."
                />
              </div>
              <div className="flex space-x-3">
                <Button type="submit" className="flex-1">Send Message</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowContactForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
