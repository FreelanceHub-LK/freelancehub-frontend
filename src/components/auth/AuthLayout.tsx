"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backLink?: {
    href: string;
    label: string;
  };
  showLogo?: boolean;
  wide?: boolean; // New prop for wider layouts
  layout?: 'standard' | 'compact' | 'full'; // New layout options
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  backLink,
  showLogo = true,
  wide = false,
  layout = 'standard',
}) => {
  const getMaxWidth = () => {
    if (layout === 'full') return 'max-w-6xl';
    if (wide) return 'max-w-4xl';
    return 'max-w-md';
  };

  const getPadding = () => {
    if (layout === 'compact') return 'p-4 lg:p-6';
    if (layout === 'full') return 'p-4 lg:p-8';
    return 'p-4 lg:p-8';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-20"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-32 h-32 bg-yellow-200 rounded-full opacity-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className={`relative z-10 flex items-center justify-center min-h-screen ${getPadding()}`}>
        <div className={`w-full ${getMaxWidth()}`}>
          {/* Back Link */}
          {backLink && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Link
                href={backLink.href}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backLink.label}
              </Link>
            </motion.div>
          )}

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${
              wide ? 'lg:grid lg:grid-cols-2' : ''
            } ${
              layout === 'full' ? 'lg:grid lg:grid-cols-12' : ''
            }`}
          >
            {/* Left Side - Content */}
            <div className={`${
              wide ? 'p-6 lg:p-8 xl:p-10' : 
              layout === 'compact' ? 'p-4 lg:p-6' :
              layout === 'full' ? 'lg:col-span-8 p-6 lg:p-8' :
              'p-6 lg:p-8'
            }`}>
              {/* Logo - only show in narrow layout or left side of wide layout */}
              {showLogo && !wide && layout !== 'full' && (
                <div className="text-center mb-4 lg:mb-6">
                  <Link href="/" className="inline-block">
                    <Image
                      src="/logo.png"
                      alt="FreelanceHub"
                      width={120}
                      height={40}
                      className="mx-auto"
                    />
                  </Link>
                </div>
              )}

              {/* Logo for wide/full layout */}
              {showLogo && (wide || layout === 'full') && (
                <div className="mb-4 lg:mb-6">
                  <Link href="/" className="inline-block">
                    <Image
                      src="/logo.png"
                      alt="FreelanceHub"
                      width={120}
                      height={40}
                    />
                  </Link>
                </div>
              )}

              {/* Header */}
              <div className={`${wide || layout === 'full' ? 'text-left' : 'text-center'} mb-4 lg:mb-6`}>
                <h1 className={`${
                  layout === 'compact' ? 'text-xl lg:text-2xl' : 'text-xl lg:text-2xl xl:text-3xl'
                } font-bold text-gray-900 mb-2`}>
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-gray-600 text-sm lg:text-base">{subtitle}</p>
                )}
              </div>

              {/* Content */}
              <div className={`${
                layout === 'compact' ? 'space-y-3 lg:space-y-4' : 'space-y-4 lg:space-y-6'
              }`}>
                {children}
              </div>
            </div>

            {/* Right Side - Visual (only for wide layout) */}
            {wide && (
              <div className="hidden lg:block bg-gradient-to-br from-green-500 to-blue-600 p-8 xl:p-12 text-white relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <div className="mb-8">
                    <h2 className="text-2xl xl:text-3xl font-bold mb-4">
                      Join FreelanceHub Today
                    </h2>
                    <p className="text-green-100 text-lg">
                      Connect with talented professionals and grow your business
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Access to thousands of skilled freelancers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>24/7 customer support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Advanced project management tools</span>
                    </div>
                  </div>
                </div>

                {/* Background decorations */}
                <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute top-1/2 right-20 w-4 h-4 bg-white/30 rounded-full"></div>
              </div>
            )}

            {/* Sidebar for full layout */}
            {layout === 'full' && (
              <div className="hidden lg:block lg:col-span-4 bg-gray-50 p-6 lg:p-8 border-l border-gray-200">
                <div className="sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Why Choose FreelanceHub?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Verified Professionals</h4>
                        <p className="text-sm text-gray-600">All freelancers are background-checked and skill-verified</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Secure Payments</h4>
                        <p className="text-sm text-gray-600">Milestone-based payments with escrow protection</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">24/7 Support</h4>
                        <p className="text-sm text-gray-600">Round-the-clock customer service and dispute resolution</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export { AuthLayout };
