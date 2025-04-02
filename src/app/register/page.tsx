"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Eye, EyeOff, Briefcase, Code } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  accountType: z.enum(["client", "freelancer"]),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const defaultAccountType = searchParams.get("type") === "freelancer" ? "freelancer" : "client";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: defaultAccountType as "client" | "freelancer",
    },
  });

  const accountType = watch("accountType");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setRegisterError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          accountType: data.accountType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      router.push(data.accountType === "client" ? "/dashboard/client" : "/dashboard/freelancer");
    } catch (error) {
      setRegisterError(error instanceof Error ? error.message : "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signIn("google", { 
      callbackUrl: accountType === "client" ? "/dashboard/client" : "/dashboard/freelancer" 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative w-12 h-12">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              className="rounded-full"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {registerError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {registerError}
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("client")?.setAttribute("checked", "true");
                  document.getElementById("freelancer")?.removeAttribute("checked");
                }}
                className={`flex-1 py-3 px-4 rounded-md flex flex-col items-center justify-center border ${
                  accountType === "client"
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Briefcase className={`h-6 w-6 ${accountType === "client" ? "text-green-500" : "text-gray-400"}`} />
                <span className="mt-1 text-sm font-medium">I&apos;m a Client</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  // This would be handled by the form state setter in a real implementation
                  document.getElementById("freelancer")?.setAttribute("checked", "true");
                  document.getElementById("client")?.removeAttribute("checked");
                }}
                className={`flex-1 py-3 px-4 rounded-md flex flex-col items-center justify-center border ${
                  accountType === "freelancer"
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Code className={`h-6 w-6 ${accountType === "freelancer" ? "text-green-500" : "text-gray-400"}`} />
                <span className="mt-1 text-sm font-medium">I&apos;m a Freelancer</span>
              </button>
            </div>
            
            <div className="hidden">
              <input
                id="client"
                type="radio"
                value="client"
                {...register("accountType")}
                defaultChecked={accountType === "client"}
              />
              <input
                id="freelancer"
                type="radio"
                value="freelancer"
                {...register("accountType")}
                defaultChecked={accountType === "freelancer"}
              />
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="John Doe"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="you@example.com"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  {...register("password")}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    errors.confirmPassword ? "border-red-300" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  {...register("confirmPassword")}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignUp}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign up with Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-green-600 hover:text-green-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-green-600 hover:text-green-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}