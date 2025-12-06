'use client';

import { usePathname } from 'next/navigation';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show Header/Footer on dashboard routes, admin routes, or marketing routes (which have their own headers)
  const isDashboardRoute = pathname?.startsWith('/property-manager') ||
                          pathname?.startsWith('/admin') ||
                          pathname?.startsWith('/owner');

  // Auth routes that have their own layout
  const isAuthRoute = pathname?.startsWith('/login') ||
                     pathname?.startsWith('/register') ||
                     pathname?.startsWith('/forgot-password') ||
                     pathname?.startsWith('/reset-password') ||
                     pathname?.startsWith('/verify-email');

  // Public pages that should use the landing page header or no header
  const isPublicPage = pathname === '/' ||
                      pathname === '/home' ||
                      pathname === '/home/' ||
                      pathname?.startsWith('/get-started') ||
                      pathname?.startsWith('/about') ||
                      pathname?.startsWith('/blog') ||
                      pathname?.startsWith('/contact') ||
                      pathname?.startsWith('/faq') ||
                      pathname?.startsWith('/property-managers') ||
                      pathname?.startsWith('/compare') ||
                      pathname?.startsWith('/thank-you');

  if (isDashboardRoute || isPublicPage || isAuthRoute) {
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
