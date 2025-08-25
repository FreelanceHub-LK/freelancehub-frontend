"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FreelancerProfileSettings } from "@/components/modules/freelancers/FreelancerProfileSettings";
import { FreelancerLayout } from "@/components/freelancer/layout/FreelancerLayout";

export default function FreelancerSettingsPage() {
  const { user } = useAuth({ required: true });
  const router = useRouter();

  // Redirect if not freelancer
  useEffect(() => {
    if (user && user.role !== 'freelancer') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <FreelancerLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your profile and account preferences</p>
        </div>
        {user.id && <FreelancerProfileSettings userId={user.id} />}
      </div>
    </FreelancerLayout>
  );
}
