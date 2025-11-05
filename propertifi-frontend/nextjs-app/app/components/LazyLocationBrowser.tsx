'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const LocationBrowser = dynamic(() => import('@/app/components/LocationBrowser').then(mod => mod.LocationBrowser), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-9 w-24" />)}
        </div>
      </div>
    </div>
  ),
});

export function LazyLocationBrowser() {
    return <LocationBrowser />;
}