"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  features: string[];
  className?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  onClick,
  features,
  className,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200",
        isSelected
          ? "border-green-500 bg-green-50 shadow-lg"
          : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}

      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
        isSelected ? "bg-green-100" : "bg-gray-100"
      )}>
        <div className={cn(
          "w-6 h-6",
          isSelected ? "text-green-600" : "text-gray-600"
        )}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className={cn(
        "text-lg font-semibold mb-2",
        isSelected ? "text-green-900" : "text-gray-900"
      )}>
        {title}
      </h3>
      
      <p className={cn(
        "text-sm mb-4",
        isSelected ? "text-green-700" : "text-gray-600"
      )}>
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full mr-2",
              isSelected ? "bg-green-500" : "bg-gray-400"
            )} />
            <span className={cn(
              isSelected ? "text-green-700" : "text-gray-600"
            )}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export { RoleCard };
