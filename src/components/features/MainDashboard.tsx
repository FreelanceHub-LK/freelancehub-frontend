'use client';

import React, { lazy, Suspense } from 'react';

// Lazy load dashboard components for better performance
const FreelancerDashboard = lazy(() => import('./dashboard/FreelancerDashboard'));
const ClientDashboard = lazy(() => import('./dashboard/ClientDashboard'));
const AdminDashboard = lazy(() => import('./dashboard/AdminDashboard'));

// Loading component
const DashboardLoading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

interface MainDashboardProps {
  userRole: 'freelancer' | 'client' | 'admin';
  userId: string;
}

export default function MainDashboard({ userRole, userId }: MainDashboardProps) {
  const renderDashboard = () => {
    switch (userRole) {
      case 'freelancer':
        return <FreelancerDashboard userId={userId} />;
      case 'client':
        return <ClientDashboard userId={userId} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid User Role</h2>
              <p className="text-gray-600">Please contact support if this error persists.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={<DashboardLoading />}>
      {renderDashboard()}
    </Suspense>
  );
}
