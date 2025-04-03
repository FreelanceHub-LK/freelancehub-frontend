"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";

const mockReviews = [
  {
    id: "1",
    clientName: "Nishanth Silva",
    clientAvatar:
      "https://img.freepik.com/free-vector/follow-me-social-business-theme-design_24877-52233.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    rating: 5,
    comment:
      "Excellent work! Delivered the project on time and exceeded my expectations. Very professional and responsive.",
    projectTitle: "E-commerce Website",
    date: "2025-03-15",
  },
  {
    id: "2",
    clientName: "Priya Jayasuriya",
    clientAvatar:
      "https://img.freepik.com/free-vector/follow-me-social-business-theme-design_24877-52233.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    rating: 4,
    comment:
      "Good work overall. There were some minor issues but they were quickly resolved.",
    projectTitle: "Mobile App Development",
    date: "2025-02-20",
  },
  {
    id: "3",
    clientName: "Ravi Fernando",
    clientAvatar:
      "https://img.freepik.com/free-vector/follow-me-social-business-theme-design_24877-52233.jpg?uid=R162230089&semt=ais_hybrid&w=740",
    rating: 5,
    comment:
      "Outstanding developer! Very knowledgeable and delivered high-quality work.",
    projectTitle: "CRM System",
    date: "2025-01-10",
  },
];

interface FreelancerReviewsProps {
  freelancerId: string;
}

export const FreelancerReviews: React.FC<FreelancerReviewsProps> = ({
  freelancerId,
}) => {
  const [reviews] = useState(mockReviews);

  const avgRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  if (!reviews.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Client Reviews</h2>
        <p className="text-gray-500 italic">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">Client Reviews</h2>

      <div className="flex items-center mb-4">
        <div className="flex items-center mr-2">
          {renderStars(Math.round(avgRating))}
        </div>
        <span className="text-gray-600">
          {avgRating.toFixed(1)} ({reviews.length} reviews)
        </span>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div className="flex items-center mb-2">
              <img
                src={review.clientAvatar}
                alt={review.clientName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <div className="font-medium">{review.clientName}</div>
                <div className="text-xs text-gray-500">{review.date}</div>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <div className="flex mr-2">{renderStars(review.rating)}</div>
              <span className="text-sm text-gray-600">
                {review.projectTitle}
              </span>
            </div>

            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
