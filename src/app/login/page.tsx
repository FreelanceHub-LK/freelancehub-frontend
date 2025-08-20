"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { apiService } from "../../lib/api/axios-instance";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  profilePicture?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const response = await apiService.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const authResponse: AuthResponse = response.data as AuthResponse;

      // Store tokens
      localStorage.setItem("access_token", authResponse.accessToken);
      localStorage.setItem("refresh_token", authResponse.refreshToken);
      localStorage.setItem("user", JSON.stringify({
        id: authResponse.id,
        name: authResponse.name,
        email: authResponse.email,
        role: authResponse.role,
        profilePicture: authResponse.profilePicture,
      }));

      // Redirect based on role
      const redirectPath = authResponse.role === "client" ? "/projects" : "/freelancers";
      router.push(redirectPath);
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(
        error.response?.data?.message || 
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setAuthError("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your FreelanceHub account"
      backLink={{
        href: "/",
        label: "Back to Home"
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {authError && (
          <Alert
            variant="error"
            description={authError}
            onClose={() => setAuthError("")}
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

        <Input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Enter your password"
          icon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          error={errors.password?.message}
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-green-600 hover:text-green-500 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>

      <SocialAuth
        onGoogleSignIn={handleGoogleSignIn}
        isLoading={isLoading}
        disabled={isLoading}
      />

      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-green-600 hover:text-green-500 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}