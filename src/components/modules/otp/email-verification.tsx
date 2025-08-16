// components/email-verification.tsx
"use client";
import { useState } from "react";
import { apiService } from "../../../lib/api/axios-instance";
import { toast } from "@/context/toast-context";

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
}

export default function EmailVerification({ email, onVerified }: EmailVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await apiService.post("/auth/verify-otp", {
        email,
        otp,
      });
      
      toast.success("Email verified successfully!");
      onVerified();
    } catch (error: any) {
      setError(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await apiService.post("/auth/resend-otp", {
        email,
      });
      
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Verify Your Email</h2>
      <p className="text-gray-600 mb-6">
        We've sent a verification code to <strong>{email}</strong>. Please enter it below.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleResendOtp}
            className="text-green-600 hover:text-green-500 text-sm"
            disabled={isLoading}
          >
            Resend Code
          </button>
          
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </div>
      </form>
    </div>
  );
}