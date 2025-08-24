"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, CheckCircle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PasskeySetup } from "@/components/auth/PasskeySetup";
import { useAuth } from "@/context/auth-context";
import { passkeyApi, webAuthnUtils } from "@/lib/api/registration";
import { toast } from "@/context/toast-context";

type OnboardingStep = 'welcome' | 'passkey' | 'completed';

export default function ClientOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [passkeyError, setPasskeyError] = useState('');

  // Redirect if not authenticated or not a client
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'client') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleContinueToPasskey = () => {
    setCurrentStep('passkey');
  };

  const handleSkipPasskey = () => {
    setCurrentStep('completed');
    toast.success('Account setup completed! Welcome to FreelanceHub!');
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handleSetupPasskey = async (deviceName: string) => {
    try {
      setIsLoading(true);
      setPasskeyError('');

      // Use the webAuthnUtils to create the credential properly
      const options = await passkeyApi.initiateRegistration(deviceName);
      const credential = await webAuthnUtils.createCredential(options);
      await passkeyApi.completeRegistration(credential, deviceName);

      toast.success('Passkey set up successfully!');
      setCurrentStep('completed');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Passkey setup error:', error);
      setPasskeyError(error.message || 'Failed to set up passkey');
      toast.error('Failed to set up passkey. You can try again later from your security settings.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'client') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {currentStep === 'welcome' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to FreelanceHub, {user.name}!
            </h1>
            
            <p className="text-gray-600 mb-8 text-lg">
              Your account has been successfully created and verified. Let's secure your account with a passkey for faster and safer logins.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Why set up a passkey?
                  </h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Faster login with just your fingerprint or face</li>
                    <li>• More secure than passwords</li>
                    <li>• Works with Face ID, Touch ID, Windows Hello</li>
                    <li>• No need to remember complex passwords</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleContinueToPasskey}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium"
              >
                Set Up Passkey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={handleSkipPasskey}
                variant="secondary"
                className="px-8 py-3 rounded-lg font-medium"
              >
                Skip for Now
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              You can always set up a passkey later from your <Link href="/settings/security" className="text-green-600 hover:text-green-700 underline">security settings</Link>
            </p>
          </motion.div>
        )}

        {currentStep === 'passkey' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Set Up Your Passkey
              </h2>
              <button
                onClick={() => setCurrentStep('welcome')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <PasskeySetup
              onSetupPasskey={handleSetupPasskey}
              onSkip={handleSkipPasskey}
              isLoading={isLoading}
              error={passkeyError}
            />
          </motion.div>
        )}

        {currentStep === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              All Set! 🎉
            </h1>
            
            <p className="text-gray-600 mb-8 text-lg">
              Your account is now ready. Let's start finding the perfect freelancers for your projects!
            </p>

            <div className="animate-pulse">
              <p className="text-sm text-gray-500">
                Redirecting to your dashboard...
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
