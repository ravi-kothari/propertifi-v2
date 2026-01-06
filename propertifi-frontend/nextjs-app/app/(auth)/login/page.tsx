'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialType = searchParams.get('type') || 'owner';
  const [userType, setUserType] = useState<'owner' | 'manager'>(
    initialType === 'manager' ? 'manager' : 'owner'
  );

  const handleTabChange = (type: 'owner' | 'manager') => {
    setUserType(type);
    router.replace(`/login?type=${type}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/home" className="inline-flex items-center space-x-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" fill="#3B82F6" />
              <path d="M16 10L2 17L16 24L30 17L16 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 9L16 16V30" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30 9L16 16" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-extrabold text-2xl text-gray-900">PROPERTIFI</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Selector */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => handleTabChange('owner')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all relative ${userType === 'owner'
                ? 'text-blue-600 bg-blue-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Property Owner
              </div>
              {userType === 'owner' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
            <button
              onClick={() => handleTabChange('manager')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all relative ${userType === 'manager'
                ? 'text-orange-600 bg-orange-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" />
                </svg>
                Property Manager
              </div>
              {userType === 'manager' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={userType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header Text */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userType === 'owner' ? 'Welcome Back' : 'Manager Sign In'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {userType === 'owner'
                      ? 'Access your saved calculations and PM matches'
                      : 'Manage your profile and respond to leads'
                    }
                  </p>
                </div>

                {/* Login Form */}
                <LoginForm />

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-3 text-gray-500">or</span>
                  </div>
                </div>

                {/* Register / Special Actions */}
                {userType === 'owner' ? (
                  <div className="space-y-4">
                    <p className="text-center text-sm text-gray-600">
                      Don&apos;t have an account?{' '}
                      <Link href="/register?type=owner" className="font-semibold text-blue-600 hover:text-blue-500">
                        Create one for free
                      </Link>
                    </p>
                    <div className="text-center">
                      <Link
                        href="/get-started"
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Or continue as guest →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm text-orange-800">
                        <strong>New to Propertifi?</strong> Join our network of verified property managers and start receiving quality leads.
                      </p>
                      <Link
                        href="/register/pm"
                        className="inline-block mt-2 text-sm font-semibold text-orange-600 hover:text-orange-500"
                      >
                        Apply to Join →
                      </Link>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      Already have a profile?{' '}
                      <Link href="/property-managers" className="font-semibold text-orange-600 hover:text-orange-500">
                        Find & Claim It
                      </Link>
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <Link href="/home" className="hover:text-gray-700">Back to Home</Link>
          <span className="mx-2">•</span>
          <Link href="/home#contact" className="hover:text-gray-700">Need Help?</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}