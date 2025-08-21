"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, Briefcase, Users, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { RoleCard } from "@/components/ui/RoleCard";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { SkillsSelection } from "@/components/auth/SkillsSelection";
import { PasskeySetup } from "@/components/auth/PasskeySetup";
import { freelancerApi, passkeyApi, webAuthnUtils } from "@/lib/api/registration";
import { apiService } from "../../lib/api/axios-instance";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["client", "freelancer"]),
    location: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  profilePicture?: string;
}

type RegistrationStep = "role" | "details" | "verification" | "skills" | "passkey" | "complete";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("role");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [registeredUser, setRegisteredUser] = useState<AuthResponse | null>(null);

  const defaultRole = (searchParams.get("type") === "freelancer" ? "freelancer" : "client") as "client" | "freelancer";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: defaultRole,
      location: "",
      phone: "",
    },
  });

  const watchedRole = watch("role");

  const roleOptions = [
    {
      id: "client",
      title: "I'm a Client",
      description: "I want to hire talented freelancers for my projects",
      icon: <Briefcase className="w-6 h-6" />,
      features: [
        "Post unlimited projects",
        "Browse freelancer profiles",
        "Secure payment system",
        "24/7 customer support"
      ]
    },
    {
      id: "freelancer",
      title: "I'm a Freelancer",
      description: "I want to offer my skills and find great work opportunities",
      icon: <Users className="w-6 h-6" />,
      features: [
        "Create a professional profile",
        "Bid on projects",
        "Showcase your portfolio",
        "Get paid securely"
      ]
    }
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setRegisterError("");

    try {
      const response = await apiService.post("/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        location: data.location,
        phone: data.phone,
      });

      // Send OTP for email verification
      await apiService.post("/auth/send-otp", {
        email: data.email,
      });

      setCurrentStep("verification");
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegisterError(
        error.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (otp: string) => {
    setIsLoading(true);
    setRegisterError("");

    try {
      await apiService.post("/auth/verify-otp", {
        email: getValues("email"),
        otp,
      });

      // Log in the user after verification
      const loginResponse = await apiService.post("/auth/login", {
        email: getValues("email"),
        password: getValues("password"),
      });

      const authResponse: AuthResponse = loginResponse.data as AuthResponse;
      setRegisteredUser(authResponse);

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

      // Determine next step based on role
      if (authResponse.role === "freelancer") {
        setCurrentStep("skills");
      } else {
        setCurrentStep("passkey");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setRegisterError(
        error.response?.data?.message || 
        "Email verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setRegisterError("");

    try {
      await apiService.post("/auth/send-otp", {
        email: getValues("email"),
      });
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setRegisterError(
        error.response?.data?.message || 
        "Failed to resend OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillsSubmit = async () => {
    if (selectedSkills.length === 0) return;
    
    setIsLoading(true);
    try {
      // Update freelancer profile with skills
      await freelancerApi.updateSkills(selectedSkills);
      setCurrentStep("passkey");
    } catch (error: any) {
      console.error("Skills update error:", error);
      setRegisterError("Failed to save skills. You can add them later in your profile.");
      setCurrentStep("passkey");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillsSkip = () => {
    setCurrentStep("passkey");
  };

  const handlePasskeySetup = async (deviceName: string) => {
    try {
      if (!webAuthnUtils.isWebAuthnSupported()) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      // Get registration options from the server
      const options = await passkeyApi.initiateRegistration(deviceName);
      
      // Create the credential using WebAuthn
      const credential = await webAuthnUtils.createCredential(options);
      
      // Complete registration on the server
      await passkeyApi.completeRegistration(credential, deviceName);
      
      setCurrentStep("complete");
    } catch (error: any) {
      console.error("Passkey setup error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to setup passkey");
    }
  };

  const handlePasskeySkip = () => {
    setCurrentStep("complete");
  };

  const handleCompleteRegistration = () => {
    // Redirect based on role
    const redirectPath = registeredUser?.role === "client" ? "/projects" : "/freelancer-dashboard";
    router.push(redirectPath);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setRegisterError("Google sign-in failed. Please try again.");
    }
  };

  const handleNextStep = () => {
    if (currentStep === "role") {
      setCurrentStep("details");
    }
  };

  const handleBackStep = () => {
    if (currentStep === "details") {
      setCurrentStep("role");
    } else if (currentStep === "verification") {
      setCurrentStep("details");
    } else if (currentStep === "skills") {
      setCurrentStep("verification");
    } else if (currentStep === "passkey") {
      setCurrentStep(watchedRole === "freelancer" ? "skills" : "verification");
    }
  };

  const getStepNumber = () => {
    const steps = ["role", "details", "verification"];
    if (watchedRole === "freelancer") {
      steps.push("skills", "passkey");
    } else {
      steps.push("passkey");
    }
    return steps.indexOf(currentStep) + 1;
  };

  const getTotalSteps = () => {
    return watchedRole === "freelancer" ? 5 : 4;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "role": return "Choose Role";
      case "details": return "Account Details";
      case "verification": return "Email Verification";
      case "skills": return "Add Skills";
      case "passkey": return "Security Setup";
      case "complete": return "Welcome!";
      default: return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "role":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Choose Your Account Type
              </h2>
              <p className="text-gray-600">
                Select how you plan to use FreelanceHub
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {roleOptions.map((option) => (
                <RoleCard
                  key={option.id}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                  features={option.features}
                  isSelected={watchedRole === option.id}
                  onClick={() => setValue("role", option.id as "client" | "freelancer")}
                />
              ))}
            </div>

            <Button
              onClick={handleNextStep}
              fullWidth
              disabled={!watchedRole}
            >
              Continue
            </Button>
          </div>
        );

      case "details":
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {registerError && (
              <Alert
                variant="error"
                description={registerError}
                onClose={() => setRegisterError("")}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                {...register("firstName")}
                label="First Name"
                placeholder="Enter your first name"
                icon={<User className="w-4 h-4" />}
                error={errors.firstName?.message}
                disabled={isLoading}
              />

              <Input
                {...register("lastName")}
                label="Last Name"
                placeholder="Enter your last name"
                icon={<User className="w-4 h-4" />}
                error={errors.lastName?.message}
                disabled={isLoading}
              />
            </div>

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
              placeholder="Create a password"
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
              helperText="Must be at least 6 characters"
            />

            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="Confirm your password"
              icon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              error={errors.confirmPassword?.message}
              disabled={isLoading}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                {...register("location")}
                label="Location (Optional)"
                placeholder="City, Country"
                icon={<MapPin className="w-4 h-4" />}
                disabled={isLoading}
              />

              <Input
                {...register("phone")}
                label="Phone (Optional)"
                placeholder="+1 (555) 123-4567"
                icon={<Phone className="w-4 h-4" />}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackStep}
                disabled={isLoading}
                className="lg:flex-1"
              >
                Back
              </Button>
              
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="lg:flex-1"
              >
                Create Account
              </Button>
            </div>
          </form>
        );

      case "verification":
        return (
          <OTPVerification
            email={getValues("email")}
            onVerify={handleOTPVerification}
            onResend={handleResendOTP}
            isLoading={isLoading}
            error={registerError}
            onBack={handleBackStep}
          />
        );

      case "skills":
        return (
          <SkillsSelection
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            onNext={handleSkillsSubmit}
            onSkip={handleSkillsSkip}
            isLoading={isLoading}
          />
        );

      case "passkey":
        return (
          <PasskeySetup
            onSetupPasskey={handlePasskeySetup}
            onSkip={handlePasskeySkip}
            isLoading={isLoading}
            error={registerError}
          />
        );

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              Welcome to FreelanceHub!
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Your account has been successfully created. You're now ready to start your freelance journey.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg text-left">
              <h3 className="font-medium text-green-900 mb-2">What's next?</h3>
              <ul className="text-sm text-green-800 space-y-1">
                {watchedRole === "freelancer" ? (
                  <>
                    <li>• Complete your profile with portfolio and experience</li>
                    <li>• Browse and apply to projects</li>
                    <li>• Build your reputation with quality work</li>
                  </>
                ) : (
                  <>
                    <li>• Post your first project</li>
                    <li>• Browse freelancer profiles</li>
                    <li>• Start collaborating with talented professionals</li>
                  </>
                )}
              </ul>
            </div>

            <Button onClick={handleCompleteRegistration} className="w-full">
              {watchedRole === "freelancer" ? "Go to Dashboard" : "Browse Projects"}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const getLayoutConfig = () => {
    switch (currentStep) {
      case "role":
        return { wide: true, layout: 'standard' as const };
      case "details":
        return { wide: true, layout: 'compact' as const };
      case "verification":
        return { wide: false, layout: 'compact' as const };
      case "skills":
        return { wide: true, layout: 'full' as const };
      case "passkey":
        return { wide: true, layout: 'standard' as const };
      case "complete":
        return { wide: true, layout: 'standard' as const };
      default:
        return { wide: false, layout: 'standard' as const };
    }
  };

  const layoutConfig = getLayoutConfig();

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join thousands of freelancers and clients on FreelanceHub"
      backLink={{
        href: "/",
        label: "Back to Home"
      }}
      wide={layoutConfig.wide}
      layout={layoutConfig.layout}
    >
      {currentStep !== "role" && currentStep !== "complete" && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Step {getStepNumber()} of {getTotalSteps()}</span>
            <span>{getStepTitle()}</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(getStepNumber() / getTotalSteps()) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {renderStepContent()}

      {currentStep === "details" && (
        <>
          <SocialAuth
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={isLoading}
            disabled={isLoading}
          />

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-500 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </>
      )}
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}