"use client";
import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Smartphone, Check, AlertCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { passkeyApi, webAuthnUtils } from '@/lib/api/registration';
import { deviceUtils } from '@/lib/utils/device';
import { useAuth } from '@/context/auth-context';

interface PasskeySetupProps {
  onSetupPasskey: (deviceName: string) => Promise<void>;
  onSkip: () => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export function PasskeySetup({
  onSetupPasskey,
  onSkip,
  isLoading = false,
  error,
  className = ""
}: PasskeySetupProps) {
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState<'intro' | 'setup' | 'success'>('intro');
  const [deviceName, setDeviceName] = useState('');
  const [setupError, setSetupError] = useState('');
  const [isWebAuthnSupported] = useState(webAuthnUtils.isWebAuthnSupported());
  const [autoDeviceName, setAutoDeviceName] = useState('');
  const [useAutoName, setUseAutoName] = useState(true);

  // Initialize device name automatically
  useEffect(() => {
    try {
      const detectedName = deviceUtils.generateDeviceName();
      console.log('Auto-detected device name:', detectedName);
      setAutoDeviceName(detectedName);
      setDeviceName(detectedName);
    } catch (error) {
      console.error('Error detecting device name:', error);
      // Fallback to a generic name
      const fallbackName = 'This Device';
      setAutoDeviceName(fallbackName);
      setDeviceName(fallbackName);
    }
  }, []);

  const handleSetupPasskey = async () => {
    const finalDeviceName = useAutoName ? autoDeviceName : deviceName;
    
    if (!finalDeviceName.trim()) {
      setSetupError('Please enter a device name or use the auto-detected name');
      return;
    }

    if (!isWebAuthnSupported) {
      setSetupError('Passkeys are not supported in this browser. Please use a modern browser that supports WebAuthn.');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token || !isAuthenticated) {
      setSetupError('Authentication required. Please refresh the page and try again, or continue without setting up a passkey.');
      return;
    }

    console.log('Authentication check:', {
      hasToken: !!token,
      isAuthenticated,
      userId: user?.id,
      userEmail: user?.email
    });

    setSetupError('');
    setStep('setup');

    try {
      console.log('Initiating passkey registration for device:', finalDeviceName.trim());
      console.log('Auth token available:', !!token);
      
      // Get registration options from the server
      const options = await passkeyApi.initiateRegistration(finalDeviceName.trim());
      
      console.log('Registration options received, creating credential...');
      
      // Create the credential using WebAuthn
      const credential = await webAuthnUtils.createCredential(options);
      
      console.log('Credential created successfully, completing registration...');
      
      // Complete registration on the server
      await passkeyApi.completeRegistration(credential, finalDeviceName.trim());
      
      console.log('Passkey registration completed successfully!');
      
      setStep('success');
      
      // Call the onSetupPasskey callback
      if (onSetupPasskey) {
        await onSetupPasskey(finalDeviceName.trim());
      }
    } catch (error: any) {
      console.error('Passkey setup error:', error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = error.message || 'Failed to setup passkey. Please try again.';
      
      if (error.message?.includes('Server provided invalid data') || 
          error.message?.includes('Invalid server data')) {
        errorMessage = 'There was an issue with the server configuration. Please contact support or try again later.';
      } else if (error.message?.includes('challenge')) {
        errorMessage = 'Authentication challenge failed. Please refresh the page and try again.';
      } else if (error.message?.includes('base64')) {
        errorMessage = 'Data format error. Please refresh the page and try again.';
      } else if (error.message?.includes('You must be logged in')) {
        errorMessage = 'Authentication required. Please refresh the page and try again, or continue without setting up a passkey.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please refresh the page and try again, or continue without setting up a passkey.';
      }
      
      setSetupError(errorMessage);
      setStep('intro');
    }
  };

  const renderIntroStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          Secure Your Account with Passkeys
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Add an extra layer of security to your account with passkey authentication.
        </p>
      </div>

      {!isWebAuthnSupported && (
        <Alert
          variant="error"
          description="Your browser doesn't support passkeys. Please update to a modern browser to use this feature."
        />
      )}

      {/* Authentication status indicator for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <Alert
          variant={isAuthenticated ? "success" : "error"}
          description={`Authentication Status: ${isAuthenticated ? 'Authenticated' : 'Not Authenticated'} ${user?.email ? `(${user.email})` : ''}`}
        />
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          What are Passkeys?
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start gap-3">
            <Fingerprint className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Biometric Authentication</p>
              <p className="text-blue-700">Use your fingerprint, face, or device PIN to sign in</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Enhanced Security</p>
              <p className="text-blue-700">More secure than passwords, resistant to phishing</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Device-Based</p>
              <p className="text-blue-700">Works across all your devices that support passkeys</p>
            </div>
          </div>
        </div>
      </div>

      {(error || setupError) && (
        <Alert
          variant="error"
          description={error || setupError}
          onClose={() => setSetupError('')}
        />
      )}

      <div className="space-y-4">
        {/* Auto-detected device name option */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="useAutoName"
              checked={useAutoName}
              onChange={(e) => {
                setUseAutoName(e.target.checked);
                if (e.target.checked) {
                  setDeviceName(autoDeviceName);
                }
              }}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={isLoading || !isWebAuthnSupported}
            />
            <label htmlFor="useAutoName" className="text-sm font-medium text-gray-700">
              Use auto-detected device name
            </label>
          </div>
          
          {useAutoName && autoDeviceName && (
            <div className="ml-7 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Detected device:</p>
              <p className="font-medium text-gray-900">{autoDeviceName}</p>
            </div>
          )}
        </div>

        <Input
          label="Device Name"
          placeholder="e.g., My Laptop, iPhone, Work Computer"
          value={useAutoName ? autoDeviceName : deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          disabled={isLoading || !isWebAuthnSupported || useAutoName}
          helperText={useAutoName ? "Using auto-detected device name" : "Give this device a name so you can identify it later"}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSetupPasskey}
            disabled={!deviceName.trim() || isLoading || !isWebAuthnSupported}
            isLoading={isLoading}
            className="flex-1"
          >
            Setup Passkey
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          You can always set up passkeys later in your security settings.
        </p>
      </div>
    </div>
  );

  const renderSetupStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
        <Fingerprint className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
        Follow your browser's instructions
      </h2>
      <p className="text-gray-600 text-sm md:text-base">
        Your browser will guide you through setting up a passkey for "{deviceName}".
        This may involve using your fingerprint, face recognition, or device PIN.
      </p>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <p className="font-medium text-yellow-800">Important</p>
            <p className="text-sm text-yellow-700">
              Make sure you're on a trusted device. Passkeys are tied to this specific device and browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
        Passkey Setup Complete!
      </h2>
      <p className="text-gray-600 text-sm md:text-base">
        Your passkey "{deviceName}" has been successfully set up. You can now use it to sign in securely.
      </p>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="space-y-3 text-sm text-green-800">
          <div className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span className="font-medium">Enhanced security enabled</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span className="font-medium">Faster sign-in experience</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span className="font-medium">No passwords required</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onSkip} // This will continue to the next step
        className="w-full"
      >
        Continue to Dashboard
      </Button>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {step === 'intro' && renderIntroStep()}
      {step === 'setup' && renderSetupStep()}
      {step === 'success' && renderSuccessStep()}
    </div>
  );
}
