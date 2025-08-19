"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
  onBack?: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  isLoading = false,
  error,
  onBack,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      await onVerify(otpValue);
    }
  };

  const handleResend = async () => {
    await onResend();
    setResendTimer(60);
    setCanResend(false);
    setOtp(new Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      {error && (
        <Alert variant="error" description={error} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-2">
          {otp.map((data, index) => (
            <motion.input
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              type="text"
              maxLength={1}
              ref={(el) => { inputRefs.current[index] = el; }}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              disabled={isLoading}
            />
          ))}
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={otp.join("").length !== 6}
        >
          Verify Email
        </Button>
      </form>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">Didn't receive the code?</p>
        <Button
          variant="ghost"
          onClick={handleResend}
          disabled={!canResend || isLoading}
          className="text-green-600 hover:bg-green-50"
        >
          {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
        </Button>
      </div>

      {onBack && (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
            className="text-gray-600 hover:bg-gray-50"
          >
            Back to Registration
          </Button>
        </div>
      )}
    </div>
  );
};

export { OTPVerification };
