'use client';

import { usePathname } from 'next/navigation';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show Header/Footer on dashboard routes or admin routes
  const isDashboardRoute = pathname?.startsWith('/property-manager') ||
                          pathname?.startsWith('/admin') ||
                          pathname?.startsWith('/owner');

  if (isDashboardRoute) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <ThemeProvider>
      <Header />
      {children}
      <Footer />
      <Toaster />
    </ThemeProvider>
  );
}
