"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Fingerprint, Smartphone, ArrowRight, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PasskeySetup } from "@/components/auth/PasskeySetup";

interface PasskeyStepProps {
  onPasskeySetup: (setup: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function PasskeyStep({ 
  onPasskeySetup, 
  onNext, 
  onBack, 
  onSkip, 
  isLoading,
  setIsLoading 
}: PasskeyStepProps) {
  const [showSetup, setShowSetup] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const handleSetupPasskey = async (deviceName: string) => {
    setIsLoading(true);
    try {
      // Simulate passkey setup process
      // In a real implementation, this would call the backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSetupComplete(true);
      onPasskeySetup(true);
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (error) {
      console.error('Passkey setup error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipPasskey = () => {
    onPasskeySetup(false);
    onSkip();
  };

  if (setupComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Passkey Setup Complete! 🎉
          </h2>
          <p className="text-gray-600 text-lg">
            Your account is now secured with passwordless authentication.
          </p>
        </motion.div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <PasskeySetup
            onSetupPasskey={handleSetupPasskey}
            onSkip={() => {
              setShowSetup(false);
              handleSkipPasskey();
            }}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Secure Your Account
          </h2>
          <p className="text-gray-600 text-lg">
            Set up passwordless authentication for enhanced security
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-6 bg-blue-50 rounded-xl"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Biometric Login</h3>
            <p className="text-sm text-gray-600">
              Use your fingerprint, face, or device PIN for secure access
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6 bg-green-50 rounded-xl"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Enhanced Security</h3>
            <p className="text-sm text-gray-600">
              Stronger protection than traditional passwords
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-6 bg-purple-50 rounded-xl"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Device-Based</h3>
            <p className="text-sm text-gray-600">
              Works across all your devices securely
            </p>
          </motion.div>
        </div>

        {/* How it Works */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How Passkeys Work</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                1
              </div>
              <p className="text-gray-700">We'll create a secure passkey tied to your device</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                2
              </div>
              <p className="text-gray-700">You'll use your device's biometric or PIN to authenticate</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                3
              </div>
              <p className="text-gray-700">Login becomes faster and more secure than passwords</p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Privacy & Security</h4>
              <p className="text-amber-800 text-sm">
                Your biometric data never leaves your device. Passkeys use advanced cryptography 
                and are more secure than passwords.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSkipPasskey}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
            >
              Skip for now
            </Button>
            <Button
              onClick={() => setShowSetup(true)}
              disabled={isLoading}
              isLoading={isLoading}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              Set Up Passkey
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Skip Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            You can always set up passkey authentication later in your security settings
          </p>
        </div>
      </motion.div>
    </div>
  );
}
