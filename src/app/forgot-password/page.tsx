"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { apiService } from "../../lib/api/axios-instance";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      await apiService.post("/auth/forgot-password", {
        email: data.email,
      });

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setError(
        error.response?.data?.message || 
        "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent a password reset link to your email"
        backLink={{
          href: "/login",
          label: "Back to Login"
        }}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Reset Link Sent
            </h3>
            <p className="text-gray-600">
              If an account with that email exists, we've sent you a password reset link.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => router.push("/login")}
              fullWidth
            >
              Back to Login
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setIsSuccess(false)}
              fullWidth
            >
              Send Another Email
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link"
      backLink={{
        href: "/login",
        label: "Back to Login"
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert
            variant="error"
            description={error}
            onClose={() => setError("")}
          />
        )}

        <Input
          {...register("email")}
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          disabled={isLoading}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:text-green-500 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
