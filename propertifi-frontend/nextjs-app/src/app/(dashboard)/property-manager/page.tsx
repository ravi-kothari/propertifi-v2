
'use client';
import { useLeads } from '@/app/hooks/useLeads';
import { useAuth } from '@/app/hooks/useAuth';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';

const LeadPipeline = dynamic(() => import('@/app/components/leads/LeadPipeline'), {
  loading: () => <LoadingSpinner />,
});

export default function DashboardPage() {
  const { user } = useAuth();
  // @ts-ignore
  const { data: leads, isLoading, isError } = useLeads(user.id);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading leads.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Your Lead Pipeline</h1>
      <LeadPipeline leads={leads} />
    </div>
  );
}
