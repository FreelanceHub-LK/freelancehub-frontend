"use client";
import React, { useState } from 'react';
import { Shield, Fingerprint, Smartphone, Check, AlertCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { passkeyApi, webAuthnUtils } from '@/lib/api/registration';

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
  const [step, setStep] = useState<'intro' | 'setup' | 'success'>('intro');
  const [deviceName, setDeviceName] = useState('');
  const [setupError, setSetupError] = useState('');
  const [isWebAuthnSupported] = useState(webAuthnUtils.isWebAuthnSupported());

  const handleSetupPasskey = async () => {
    if (!deviceName.trim()) {
      setSetupError('Please enter a device name');
      return;
    }

    if (!isWebAuthnSupported) {
      setSetupError('Passkeys are not supported in this browser. Please use a modern browser that supports WebAuthn.');
      return;
    }

    setSetupError('');
    setStep('setup');

    try {
      // Get registration options from the server
      const options = await passkeyApi.initiateRegistration(deviceName.trim());
      
      // Create the credential using WebAuthn
      const credential = await webAuthnUtils.createCredential(options);
      
      // Complete registration on the server
      await passkeyApi.completeRegistration(credential, deviceName.trim());
      
      setStep('success');
    } catch (error: any) {
      console.error('Passkey setup error:', error);
      setSetupError(error.message || 'Failed to setup passkey. Please try again.');
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
        <Input
          label="Device Name"
          placeholder="e.g., My Laptop, iPhone, Work Computer"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          disabled={isLoading || !isWebAuthnSupported}
          helperText="Give this device a name so you can identify it later"
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
