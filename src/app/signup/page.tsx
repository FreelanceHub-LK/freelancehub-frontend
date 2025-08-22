"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"client" | "freelancer" | null>(null);

  const handleCreateAccount = () => {
    if (selectedRole) {
      router.push(`/register?type=${selectedRole}`);
    }
  };

  const roleOptions = [
    {
      id: "client" as const,
      title: "I'm a client, hiring for a project",
      icon: <Briefcase className="w-8 h-8" />,
    },
    {
      id: "freelancer" as const,
      title: "I'm a freelancer, looking for work",
      icon: <Users className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="FreelanceHub"
                width={140}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">Already have an account?</span>
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Join as a client or freelancer
            </motion.h1>
          </div>

          {/* Role Selection Cards */}
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {roleOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedRole(option.id)}
                  className={`
                    relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200
                    ${
                      selectedRole === option.id
                        ? "border-green-500 bg-green-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                    }
                  `}
                >
                  {/* Radio Button */}
                  <div className="absolute top-6 right-6">
                    <div
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${
                          selectedRole === option.id
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }
                      `}
                    >
                      {selectedRole === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`
                      w-16 h-16 rounded-lg flex items-center justify-center mb-6
                      ${
                        selectedRole === option.id
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {option.icon}
                  </div>

                  {/* Title */}
                  <h3
                    className={`
                      text-xl font-semibold leading-relaxed
                      ${
                        selectedRole === option.id
                          ? "text-green-900"
                          : "text-gray-900"
                      }
                    `}
                  >
                    {option.title}
                  </h3>
                </motion.div>
              ))}
            </div>

            {/* Create Account Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <Button
                onClick={handleCreateAccount}
                disabled={!selectedRole}
                className={`
                  px-12 py-4 text-lg font-medium rounded-full transition-all duration-200
                  ${
                    selectedRole
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Create Account
                {selectedRole && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-8"
            >
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Log In
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              By joining, you agree to our{" "}
              <Link href="/terms" className="text-green-600 hover:text-green-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-green-600 hover:text-green-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
