'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
    // Here you would typically initialize analytics
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. 
          <Link href="/privacy-policy" className="underline">Learn more</Link>.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleAccept}>Accept</Button>
          <Button variant="outline" onClick={handleDecline}>Decline</Button>
        </div>
      </div>
    </div>
  );
}
