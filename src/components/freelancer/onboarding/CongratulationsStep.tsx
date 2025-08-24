"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Star, Award, Briefcase, Shield, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { freelancerApi } from "@/lib/api/freelancerApi";
import { toast } from "@/context/toast-context";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingData } from "@/app/freelancer/onboarding/page";

interface CongratulationsStepProps {
  onboardingData: OnboardingData;
  onComplete: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function CongratulationsStep({ 
  onboardingData, 
  onComplete, 
  isLoading,
  setIsLoading 
}: CongratulationsStepProps) {
  const { user } = useAuth();

  useEffect(() => {
    // Auto-save the profile data when this step loads
    const saveProfile = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const profileData = {
          userId: user.id,
          skills: onboardingData.skills,
          certifications: onboardingData.certificates,
          portfolioLinks: onboardingData.portfolioLinks,
          isAvailable: true,
          hourlyRate: undefined, // Can be set later
          education: '', // Can be set later
        };

        await freelancerApi.createOrGet(profileData);
        toast.success("Your freelancer profile has been created successfully!");
      } catch (error: any) {
        console.error("Profile creation error:", error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to create profile. You can complete it later from your dashboard.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    saveProfile();
  }, [user?.id, onboardingData, setIsLoading]);

  const stats = [
    {
      icon: Star,
      label: "Skills Added",
      value: onboardingData.skills.length,
      color: "text-yellow-600 bg-yellow-100"
    },
    {
      icon: Award,
      label: "Certifications",
      value: onboardingData.certificates.length,
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: Briefcase,
      label: "Portfolio Links",
      value: onboardingData.portfolioLinks.length,
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: Shield,
      label: "Security Setup",
      value: onboardingData.passkeySetup ? "Enabled" : "Skipped",
      color: "text-green-600 bg-green-100"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => {
            // Static positions to prevent hydration mismatch
            const positions = [
              { left: '15%', top: '20%' },
              { left: '85%', top: '30%' },
              { left: '25%', top: '70%' },
              { left: '75%', top: '80%' },
              { left: '45%', top: '15%' },
              { left: '65%', top: '60%' }
            ];
            
            return (
              <motion.div
                key={i}
                className="absolute w-4 h-4 text-yellow-300"
                style={{
                  left: positions[i].left,
                  top: positions[i].top,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.div>
            );
          })}
        </div>

        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mx-auto w-32 h-32 mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Rocket className="w-16 h-16 text-white" />
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
          >
            🎉
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
            className="absolute -bottom-2 -left-3 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center"
          >
            ⭐
          </motion.div>
        </motion.div>

        {/* Congratulations Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Congratulations! 🎉
          </h1>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Welcome to FreelanceHub, {user?.name?.split(' ')[0] || user?.name}!
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your freelancer profile is now live and ready to attract amazing clients. 
            You're all set to start your freelancing journey!
          </p>
        </motion.div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Browse Projects</h4>
                <p className="text-sm text-gray-600">Find exciting projects that match your skills</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Submit Proposals</h4>
                <p className="text-sm text-gray-600">Apply to projects and showcase your expertise</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Build Reputation</h4>
                <p className="text-sm text-gray-600">Complete projects and earn great reviews</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onComplete}
            disabled={isLoading}
            isLoading={isLoading}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? "Setting up your profile..." : "Go to Dashboard"}
            <Sparkles className="ml-2 w-6 h-6" />
          </Button>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-8"
        >
          <p className="text-gray-500 text-sm">
            You can always update your profile, add more skills, or modify your information 
            from your dashboard settings.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
