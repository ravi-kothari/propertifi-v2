'use client';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth(); // Example hook

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'property_manager') {
     redirect('/unauthorized');
  }

  return (
    <div>
      {/* Add DashboardHeader / DashboardSidebar here */}
      <main>{children}</main>
    </div>
  );
}
