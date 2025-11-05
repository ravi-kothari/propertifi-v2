'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WebSocketProvider } from '@/components/providers/WebSocketProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';

export default function PropertyManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login?returnUrl=/property-manager');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <WebSocketProvider userId={user?.id}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col ml-64">
          {/* Header */}
          <DashboardHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </WebSocketProvider>
  );
}
