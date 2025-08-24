"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Plus, Trash2, Smartphone, Monitor, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasskeySetup } from "@/components/auth/PasskeySetup";
import { useAuth } from "@/context/auth-context";
import { passkeyApi, webAuthnUtils } from "@/lib/api/registration";
import { toast } from "@/context/toast-context";

interface UserPasskey {
  id: string;
  deviceName: string;
  createdAt: string;
  lastUsed?: string;
  userAgent: string;
}

export default function SecuritySettingsPage() {
  const { user } = useAuth();
  const [passkeys, setPasskeys] = useState<UserPasskey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPasskey, setShowAddPasskey] = useState(false);
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPasskeys();
  }, []);

  const loadPasskeys = async () => {
    try {
      setIsLoading(true);
      const userPasskeys = await passkeyApi.getUserPasskeys();
      setPasskeys(userPasskeys);
    } catch (error: any) {
      console.error('Error loading passkeys:', error);
      toast.error('Failed to load security settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPasskey = async (deviceName: string) => {
    try {
      setIsAddingPasskey(true);
      setError('');

      const options = await passkeyApi.initiateRegistration(deviceName);
      const credential = await webAuthnUtils.createCredential(options);
      await passkeyApi.completeRegistration(credential, deviceName);

      toast.success('Passkey added successfully!');
      setShowAddPasskey(false);
      await loadPasskeys(); // Reload the list
    } catch (error: any) {
      console.error('Passkey setup error:', error);
      setError(error.message || 'Failed to add passkey');
      toast.error('Failed to add passkey. Please try again.');
    } finally {
      setIsAddingPasskey(false);
    }
  };

  const handleDeletePasskey = async (passkeyId: string, deviceName: string) => {
    if (!confirm(`Are you sure you want to remove the passkey for "${deviceName}"? You won't be able to use it to sign in anymore.`)) {
      return;
    }

    try {
      await passkeyApi.deletePasskey(passkeyId);
      toast.success('Passkey removed successfully');
      await loadPasskeys(); // Reload the list
    } catch (error: any) {
      console.error('Error deleting passkey:', error);
      toast.error('Failed to remove passkey');
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.toLowerCase().includes('mobile') || userAgent.toLowerCase().includes('android') || userAgent.toLowerCase().includes('iphone')) {
      return <Smartphone className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Settings</h1>
        <p className="text-gray-600">
          Manage your account security with passkeys for faster and more secure sign-ins.
        </p>
      </div>

      {/* Passkeys Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Passkeys</h2>
              <p className="text-sm text-gray-600">
                Sign in securely with your fingerprint, face, or device PIN
              </p>
            </div>
          </div>
          
          {!showAddPasskey && (
            <Button
              onClick={() => setShowAddPasskey(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Passkey
            </Button>
          )}
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <div className="flex">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                What are passkeys?
              </h4>
              <p className="text-blue-700 text-sm">
                Passkeys are a more secure and convenient way to sign in. They use your device's built-in 
                security (like Face ID, Touch ID, or Windows Hello) instead of passwords.
              </p>
            </div>
          </div>
        </Alert>

        {/* Add Passkey Form */}
        {showAddPasskey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <h3 className="font-medium text-gray-900 mb-4">Add New Passkey</h3>
            <PasskeySetup
              onSetupPasskey={handleAddPasskey}
              onSkip={() => setShowAddPasskey(false)}
              isLoading={isAddingPasskey}
              error={error}
            />
          </motion.div>
        )}

        {/* Passkeys List */}
        <div className="space-y-4">
          {passkeys.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No passkeys set up yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add a passkey to enable secure, password-free sign-ins
              </p>
              {!showAddPasskey && (
                <Button
                  onClick={() => setShowAddPasskey(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Passkey
                </Button>
              )}
            </div>
          ) : (
            passkeys.map((passkey) => (
              <motion.div
                key={passkey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getDeviceIcon(passkey.userAgent)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{passkey.deviceName}</h4>
                    <div className="text-sm text-gray-600">
                      <p>Created: {formatDate(passkey.createdAt)}</p>
                      {passkey.lastUsed && (
                        <p>Last used: {formatDate(passkey.lastUsed)}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleDeletePasskey(passkey.id, passkey.deviceName)}
                  variant="secondary"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Additional Security Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Security Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Passkeys are stored securely on your device and can't be shared or stolen</li>
          <li>• You can add multiple passkeys for different devices (phone, laptop, etc.)</li>
          <li>• Passkeys work across different browsers on the same device</li>
          <li>• You can always sign in with your password if passkeys aren't available</li>
        </ul>
      </div>
    </div>
  );
}
