"use client";
import React from "react";
import { User, Calendar, Clock, Star } from "lucide-react";
import Button from "@/components/ui/Button";

interface ProposalCardProps {
  id: string;
  freelancerName: string;
  freelancerAvatar?: string;
  freelancerRating: number;
  coverLetter: string;
  proposedBudget: number;
  estimatedDuration: string;
  createdAt: string;
  onAccept?: () => void;
  onReject?: () => void;
  onViewProfile?: () => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  id,
  freelancerName,
  freelancerAvatar,
  freelancerRating,
  coverLetter,
  proposedBudget,
  estimatedDuration,
  createdAt,
  onAccept,
  onReject,
  onViewProfile,
}) => {
  return (
    <div className="border rounded-lg p-5 shadow-sm bg-white mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {freelancerAvatar ? (
              <img
                src={freelancerAvatar}
                alt={freelancerName}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="text-gray-500" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-800">{freelancerName}</h3>
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i < Math.round(freelancerRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-500">
                {freelancerRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium text-green-600">
            LKR {proposedBudget.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-end">
            <Clock size={14} className="mr-1" />
            {estimatedDuration}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1">
          Cover Letter:
        </h4>
        <p className="text-gray-600 text-sm">{coverLetter}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Submitted {new Date(createdAt).toLocaleDateString()}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onViewProfile}>
            View Profile
          </Button>
          <Button variant="outline" size="sm" onClick={onReject}>
            Decline
          </Button>
          <Button size="sm" onClick={onAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};
