"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertProps {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  description,
  onClose,
  className,
  children,
}) => {
  const variants = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: Info,
      iconColor: "text-blue-600",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "border rounded-lg p-4 flex items-start space-x-3",
        config.container,
        className
      )}
    >
      <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.iconColor)} />
      <div className="flex-grow">
        {title && (
          <h4 className="font-medium text-sm mb-1">{title}</h4>
        )}
        {description && (
          <p className="text-sm opacity-90">{description}</p>
        )}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-auto text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export { Alert };
