"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { authApi } from "@/lib/api/auth";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Loading...
        </h2>
        <p className="text-gray-600">
          Please wait while we prepare your authentication...
        </p>
      </div>
    </div>
  );
}

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthSuccess = async () => {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refresh_token');
      const userId = searchParams.get('user_id');
      const name = searchParams.get('name');
      const email = searchParams.get('email');
      const role = searchParams.get('role');
      const profilePicture = searchParams.get('profile_picture');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
        return;
      }

      if (token && refreshToken) {
        try {
          // Create auth response object with available data
          const authResponse = {
            id: userId || '',
            name: name || '',
            email: email || '',
            role: role || 'client',
            profilePicture: profilePicture || undefined,
            accessToken: token,
            refreshToken: refreshToken,
          };

          // If we don't have complete user data from URL params, fetch it from backend
          if (!userId || !name || !email) {
            try {
              // Temporarily store token to make authenticated request
              localStorage.setItem('access_token', token);
              const userProfile = await authApi.getProfile();
              
              authResponse.id = userProfile.id;
              authResponse.name = userProfile.name;
              authResponse.email = userProfile.email;
              authResponse.role = userProfile.role;
              authResponse.profilePicture = userProfile.profilePicture;
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
              // Continue with available data if profile fetch fails
            }
          }

          // Use auth context to properly store authentication data
          await register(authResponse);

          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Redirect based on role
          setTimeout(() => {
            if (authResponse.role === 'freelancer') {
              router.push('/freelancer/onboarding');
            } else {
              router.push('/dashboard');
            }
          }, 2000);
        } catch (error) {
          console.error('Error storing authentication data:', error);
          setStatus('error');
          setMessage('Failed to complete authentication. Please try again.');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } else {
        setStatus('error');
        setMessage('Invalid authentication response. Please try again.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleAuthSuccess();
  }, [searchParams, router, register]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Authentication
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your sign-in...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Successful!
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthSuccessContent />
    </Suspense>
  );
}
