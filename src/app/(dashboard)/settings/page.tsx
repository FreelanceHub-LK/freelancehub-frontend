"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Key,
  Settings as SettingsIcon,
  ChevronRight
} from "lucide-react";

const settingsNavigation = [
  {
    name: "Profile",
    href: "/settings/profile",
    icon: User,
    description: "Manage your personal information and profile details"
  },
  {
    name: "Security",
    href: "/settings/security", 
    icon: Shield,
    description: "Passkeys, password, and account security settings"
  },
  {
    name: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
    description: "Email and push notification preferences"
  },
  {
    name: "Billing & Payments",
    href: "/settings/billing",
    icon: CreditCard,
    description: "Payment methods and billing information"
  },
  {
    name: "API Keys",
    href: "/settings/api-keys",
    icon: Key,
    description: "Manage API keys for integrations"
  }
];

export default function SettingsPage() {
  const pathname = usePathname();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group relative p-6 rounded-lg border transition-all duration-200
                ${isActive 
                  ? 'border-green-500 bg-green-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${isActive 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
                    }
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`
                      font-semibold text-lg mb-1
                      ${isActive ? 'text-green-900' : 'text-gray-900'}
                    `}>
                      {item.name}
                    </h3>
                    <p className={`
                      text-sm leading-relaxed
                      ${isActive ? 'text-green-700' : 'text-gray-600'}
                    `}>
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <ChevronRight className={`
                  w-5 h-5 transition-colors
                  ${isActive 
                    ? 'text-green-600' 
                    : 'text-gray-400 group-hover:text-green-600'
                  }
                `} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <SettingsIcon className="w-5 h-5 mr-2" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/settings/security"
            className="text-center p-4 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
          >
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Add Passkey</p>
            <p className="text-sm text-gray-600">Secure your account</p>
          </Link>
          
          <Link
            href="/settings/profile"
            className="text-center p-4 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
          >
            <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Update Profile</p>
            <p className="text-sm text-gray-600">Edit your information</p>
          </Link>
          
          <Link
            href="/settings/notifications"
            className="text-center p-4 rounded-lg bg-white border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
          >
            <Bell className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Notifications</p>
            <p className="text-sm text-gray-600">Manage preferences</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
