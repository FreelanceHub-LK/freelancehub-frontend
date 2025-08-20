"use client";
import React, { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Flag, MessageCircle, Calendar, User } from "lucide-react";
import { useFreelancerReviews } from "@/hooks/useFreelancers";
import Button from "@/components/ui/Button";

interface FreelancerReviewsEnhancedProps {
  freelancerId: string;
}

interface Review {
  id: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  projectTitle: string;
  date: string;
  helpful: number;
  notHelpful: number;
  response?: {
    content: string;
    date: string;
  };
}

export const FreelancerReviewsEnhanced: React.FC<FreelancerReviewsEnhancedProps> = ({
  freelancerId
}) => {
  const { reviews, stats, loading } = useFreelancerReviews(freelancerId);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');

  // Mock data for demonstration
  const mockReviews: Review[] = [
    {
      id: "1",
      clientName: "Sarah Johnson",
      clientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Exceptional work! The freelancer delivered exactly what we needed and went above and beyond our expectations. Communication was excellent throughout the project.",
      projectTitle: "E-commerce Website Development",
      date: "2024-01-15",
      helpful: 12,
      notHelpful: 0,
      response: {
        content: "Thank you Sarah! It was a pleasure working with you. I'm glad the website exceeded your expectations.",
        date: "2024-01-16"
      }
    },
    {
      id: "2",
      clientName: "Michael Chen",
      clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 5,
      comment: "Outstanding developer! Delivered the mobile app on time and within budget. Very professional and responsive.",
      projectTitle: "Mobile App Development",
      date: "2024-01-10",
      helpful: 8,
      notHelpful: 1
    },
    {
      id: "3",
      clientName: "Emily Rodriguez",
      clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      rating: 4,
      comment: "Good work overall. The design was clean and modern. There were a few minor revisions needed, but the freelancer was quick to address them.",
      projectTitle: "Logo Design & Branding",
      date: "2024-01-05",
      helpful: 5,
      notHelpful: 0
    }
  ];

  const mockStats = {
    averageRating: 4.8,
    totalReviews: 27,
    ratingDistribution: {
      5: 20,
      4: 5,
      3: 1,
      2: 1,
      1: 0
    }
  };

  const renderStars = (rating: number, size = 16) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredReviews = mockReviews.filter(review => {
    if (filter === 'all') return true;
    return review.rating === parseInt(filter);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="text-4xl font-bold mr-4">{mockStats.averageRating}</div>
              <div>
                {renderStars(mockStats.averageRating, 20)}
                <p className="text-gray-600 text-sm mt-1">
                  Based on {mockStats.totalReviews} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm w-6">{rating}</span>
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${(mockStats.ratingDistribution[rating as keyof typeof mockStats.ratingDistribution] / mockStats.totalReviews) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {mockStats.ratingDistribution[rating as keyof typeof mockStats.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
          {(['all', '5', '4', '3', '2', '1'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === filterOption
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterOption === 'all' ? 'All' : `${filterOption} stars`}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
            <option value="helpful">Most helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "This freelancer hasn't received any reviews yet."
                : `No reviews with ${filter} stars found.`
              }
            </p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={review.clientAvatar || "/api/placeholder/48/48"}
                    alt={review.clientName}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/48/48";
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.clientName}</h4>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button className="text-gray-400 hover:text-gray-600">
                  <Flag size={16} />
                </button>
              </div>

              {/* Project Title */}
              <div className="bg-blue-50 px-3 py-1 rounded-full inline-block mb-3">
                <span className="text-sm text-blue-800 font-medium">{review.projectTitle}</span>
              </div>

              {/* Review Content */}
              <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

              {/* Freelancer Response */}
              {review.response && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                  <div className="flex items-center mb-2">
                    <User size={16} className="text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-600">Response from freelancer</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {formatDate(review.response.date)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.response.content}</p>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600">
                    <ThumbsUp size={14} />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600">
                    <ThumbsDown size={14} />
                    <span>Not helpful ({review.notHelpful})</span>
                  </button>
                </div>
                
                <span className="text-xs text-gray-500">
                  Was this review helpful?
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {sortedReviews.length > 0 && sortedReviews.length >= 10 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};
