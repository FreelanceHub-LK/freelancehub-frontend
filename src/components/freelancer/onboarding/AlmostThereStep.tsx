"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AlmostThereStepProps {
  user: any;
  onNext: () => void;
  isLoading: boolean;
}

export function AlmostThereStep({ user, onNext, isLoading }: AlmostThereStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mx-auto w-24 h-24 mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
            className="absolute -bottom-1 -left-2 w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center"
          >
            ⭐
          </motion.div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            You're Almost There! 
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Welcome, <span className="font-semibold text-green-600">{user?.firstName || 'Freelancer'}</span>! 🎉
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Let's set up your freelancer profile to help you connect with amazing clients and showcase your skills to the world.
          </p>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Profile Setup</h3>
            <p className="text-sm text-gray-600 text-center">Add your skills and experience</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Verification</h3>
            <p className="text-sm text-gray-600 text-center">Secure your account</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Get Started</h3>
            <p className="text-sm text-gray-600 text-center">Start finding projects</p>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <p className="text-sm text-gray-500 mb-2">
            This will only take a few minutes
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onNext}
            disabled={isLoading}
            isLoading={isLoading}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Let's Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Skip Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6"
        >
          <p className="text-sm text-gray-500">
            You can always complete this later in your profile settings
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
