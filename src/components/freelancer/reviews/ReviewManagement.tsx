'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  TrendingUp,
  Calendar,
  User,
  Reply,
  Flag,
  Filter,
  Search,
  BarChart3,
  Award,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface Review {
  _id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  projectId: string;
  projectTitle: string;
  rating: number;
  comment: string;
  categories: {
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
  };
  isPublic: boolean;
  createdAt: string;
  response?: {
    message: string;
    createdAt: string;
  };
  helpful: number;
  contractValue: number;
}

interface ReviewStats {
  overall: {
    rating: number;
    totalReviews: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  categories: {
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
  };
  trends: {
    thisMonth: number;
    lastMonth: number;
    thisYear: number;
    lastYear: number;
  };
  platformComparison: {
    myRating: number;
    platformAverage: number;
    percentile: number;
  };
}

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'helpful'>('newest');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // This would be the actual API call
      // const response = await reviewsApi.getMyReviews();
      // setReviews(response.data);

      // Mock data for now
      const mockReviews: Review[] = [
        {
          _id: '1',
          clientId: 'c1',
          clientName: 'Sarah Johnson',
          clientAvatar: '/public/user.jpg',
          projectId: 'p1',
          projectTitle: 'E-commerce Website Development',
          rating: 5,
          comment: 'Exceptional work! The freelancer delivered exactly what we needed and went above and beyond our expectations. The communication was excellent throughout the project.',
          categories: {
            communication: 5,
            quality: 5,
            timeliness: 5,
            professionalism: 5
          },
          isPublic: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          response: {
            message: 'Thank you so much for the wonderful review! It was a pleasure working with you on this project.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          helpful: 8,
          contractValue: 2500
        },
        {
          _id: '2',
          clientId: 'c2',
          clientName: 'Mark Thompson',
          projectId: 'p2',
          projectTitle: 'Mobile App UI Design',
          rating: 4,
          comment: 'Great work overall. The designs were creative and met most of our requirements. There were some minor delays but the quality was good.',
          categories: {
            communication: 4,
            quality: 5,
            timeliness: 3,
            professionalism: 4
          },
          isPublic: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 3,
          contractValue: 1200
        },
        {
          _id: '3',
          clientId: 'c3',
          clientName: 'Emily Davis',
          projectId: 'p3',
          projectTitle: 'WordPress Theme Development',
          rating: 5,
          comment: 'Outstanding developer! Delivered a pixel-perfect theme that loads lightning fast. Highly recommend for any WordPress project.',
          categories: {
            communication: 5,
            quality: 5,
            timeliness: 5,
            professionalism: 5
          },
          isPublic: true,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 12,
          contractValue: 1800
        }
      ];

      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // This would be the actual API call
      // const response = await reviewsApi.getStats();
      // setStats(response.data);

      // Mock stats
      const mockStats: ReviewStats = {
        overall: {
          rating: 4.8,
          totalReviews: 45,
          distribution: {
            5: 32,
            4: 8,
            3: 3,
            2: 1,
            1: 1
          }
        },
        categories: {
          communication: 4.9,
          quality: 4.8,
          timeliness: 4.6,
          professionalism: 4.9
        },
        trends: {
          thisMonth: 4.9,
          lastMonth: 4.7,
          thisYear: 4.8,
          lastYear: 4.5
        },
        platformComparison: {
          myRating: 4.8,
          platformAverage: 4.2,
          percentile: 95
        }
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const submitResponse = async (reviewId: string) => {
    try {
      // await reviewsApi.respondToReview(reviewId, responseText);
      setReviews(prev => 
        prev.map(r => r._id === reviewId ? {
          ...r,
          response: {
            message: responseText,
            createdAt: new Date().toISOString()
          }
        } : r)
      );
      setSelectedReview(null);
      setResponseText('');
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      const matchesRating = filterRating === 'all' || review.rating === filterRating;
      const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRating && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
          <p className="text-gray-600 mt-1">Manage your client reviews and track your reputation</p>
        </div>

        {stats && (
          <div className="mt-4 lg:mt-0 flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold">{stats.overall.rating.toFixed(1)}</span>
              </div>
              <p className="text-sm text-gray-600">{stats.overall.totalReviews} reviews</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {stats.platformComparison.percentile}th
              </div>
              <p className="text-sm text-gray-600">Percentile</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Overall Rating</p>
                    <p className="text-2xl font-bold">{stats.overall.rating.toFixed(1)}</p>
                    <p className="text-sm text-green-600">
                      +{(stats.trends.thisMonth - stats.trends.lastMonth).toFixed(1)} from last month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Communication</p>
                    <p className="text-2xl font-bold">{stats.categories.communication.toFixed(1)}</p>
                    <p className="text-sm text-blue-600">Top category</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quality Score</p>
                    <p className="text-2xl font-bold">{stats.categories.quality.toFixed(1)}</p>
                    <p className="text-sm text-green-600">Excellent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Platform Rank</p>
                    <p className="text-2xl font-bold">{stats.platformComparison.percentile}%</p>
                    <p className="text-sm text-purple-600">Above average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Rating Distribution */}
      {stats && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Rating Distribution</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.overall.distribution[rating as keyof typeof stats.overall.distribution];
                const percentage = (count / stats.overall.totalReviews) * 100;
                
                return (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="w-12 text-sm text-gray-600 text-right">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Breakdown */}
      {stats && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Category Performance</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(stats.categories).map(([category, rating]) => (
                <div key={category} className="text-center">
                  <h4 className="font-medium capitalize mb-2">{category}</h4>
                  {renderStars(rating, 'md')}
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(rating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex space-x-4">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Reviews List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAndSortedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-500">
                {searchTerm || filterRating !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'You don\'t have any reviews yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedReviews.map((review) => (
            <motion.div key={review._id} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          {review.clientAvatar ? (
                            <img 
                              src={review.clientAvatar} 
                              alt={review.clientName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.clientName}</h3>
                          <p className="text-sm text-gray-600">{review.projectTitle}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {renderStars(review.rating, 'md')}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">${review.contractValue.toLocaleString()}</Badge>
                          {review.isPublic && <Badge variant="info">Public</Badge>}
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800">{review.comment}</p>
                    </div>

                    {/* Category Ratings */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(review.categories).map(([category, rating]) => (
                        <div key={category} className="text-center">
                          <p className="text-xs text-gray-600 capitalize mb-1">{category}</p>
                          {renderStars(rating, 'sm')}
                        </div>
                      ))}
                    </div>

                    {/* Review Response */}
                    {review.response ? (
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="flex items-start space-x-3">
                          <Reply className="w-5 h-5 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 mb-1">Your Response</p>
                            <p className="text-gray-700">{review.response.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(review.response.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{review.helpful} helpful</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReview(review)}
                          className="flex items-center space-x-2"
                        >
                          <Reply className="w-4 h-4" />
                          <span>Respond</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Respond to Review</h2>
              <p className="text-gray-600 mt-1">Responding to {selectedReview.clientName}</p>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  {renderStars(selectedReview.rating, 'sm')}
                  <span className="text-sm text-gray-600">{selectedReview.clientName}</span>
                </div>
                <p className="text-gray-800">{selectedReview.comment}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write a professional response to this review..."
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Keep your response professional and constructive. This will be visible to other clients.
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedReview(null);
                  setResponseText('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => submitResponse(selectedReview._id)}
                className="flex-1"
                disabled={!responseText.trim()}
              >
                Submit Response
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
