'use client';

import React, { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const confirmationNumber = searchParams.get('confirmation');
  const matchesCount = searchParams.get('matches') || '5';
  const leadEmail = searchParams.get('email') || '';

  const [showAccountCreation, setShowAccountCreation] = useState(!!leadEmail);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fullName, setFullName] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountError, setAccountError] = useState('');
  const { register: registerUser } = useAuth();

  // If no confirmation number, redirect back to get-started
  if (!confirmationNumber) {
    router.push('/get-started');
    return null;
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError('');

    // Validation
    if (!fullName.trim()) {
      setAccountError('Please enter your name');
      return;
    }
    if (!password || password.length < 8) {
      setAccountError('Password must be at least 8 characters');
      return;
    }
    if (password !== passwordConfirmation) {
      setAccountError('Passwords do not match');
      return;
    }

    setIsCreatingAccount(true);

    try {
      // Register user - this will also set auth state automatically
      await registerUser(fullName, leadEmail, password, passwordConfirmation);

      // Redirect to owner dashboard
      router.push('/owner');
    } catch (error: any) {
      console.error('Account creation error:', error);
      setAccountError(
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        'Failed to create account. Please try again.'
      );
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleSkip = () => {
    setShowAccountCreation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          {/* Success Message */}
          <motion.h1
            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Thank You for Choosing Propertifi!
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your request has been successfully submitted.
          </motion.p>

          {/* Confirmation Details */}
          <motion.div
            className="bg-gradient-to-br from-propertifi-blue/10 to-propertifi-orange/10 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-1">
                Your Confirmation Number
              </p>
              <p className="text-2xl font-bold text-propertifi-blue">
                {confirmationNumber}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-semibold text-gray-600 mb-1">
                Property Managers Matched
              </p>
              <p className="text-2xl font-bold text-propertifi-orange">
                {matchesCount} Professionals
              </p>
            </div>
          </motion.div>

          {/* Account Creation Section */}
          {showAccountCreation && (
            <motion.div
              className="bg-gradient-to-br from-propertifi-orange/5 to-propertifi-blue/5 border-2 border-propertifi-orange rounded-xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-propertifi-orange/10 rounded-full mb-3">
                  <svg className="w-6 h-6 text-propertifi-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Your Free Account
                </h2>
                <p className="text-gray-600">
                  Track your leads, save property managers, and get personalized recommendations
                </p>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertifi-orange focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email (pre-filled, disabled) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={leadEmail}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Using the email from your lead submission
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertifi-orange focus:border-transparent"
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                  />
                </div>

                {/* Password Confirmation */}
                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="password_confirmation"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-propertifi-orange focus:border-transparent"
                    placeholder="Re-enter your password"
                    minLength={8}
                    required
                  />
                </div>

                {/* Error Message */}
                {accountError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{accountError}</p>
                  </div>
                )}

                {/* Privacy Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900">
                    🔒 Your information is secure. We'll never sell your data.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isCreatingAccount}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingAccount ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account & Track Leads'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* What's Next */}
          <motion.div
            className="text-left mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              What happens next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-propertifi-orange/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-propertifi-orange font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Confirmation</h3>
                  <p className="text-gray-600">
                    Check your email for a confirmation and your unique reference number.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-propertifi-orange/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-propertifi-orange font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manager Review</h3>
                  <p className="text-gray-600">
                    Our matched property managers will review your property details.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-propertifi-orange/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-propertifi-orange font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Direct Contact</h3>
                  <p className="text-gray-600">
                    Expect to hear from top property managers within 24-48 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-propertifi-orange/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-propertifi-orange font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Choose Your Match</h3>
                  <p className="text-gray-600">
                    Compare quotes and select the property manager that best fits your needs.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-propertifi-orange to-propertifi-orange-dark text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Return to Home
            </Link>

            <Link
              href="/property-managers"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-propertifi-blue text-propertifi-blue rounded-lg font-semibold hover:bg-propertifi-blue hover:text-white transition-all"
            >
              Browse Property Managers
            </Link>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="mt-8 pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-600 mb-2">
              Questions? We&apos;re here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <a
                href="tel:916-250-1264"
                className="flex items-center text-propertifi-blue hover:text-propertifi-blue-dark font-semibold"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                916-250-1264
              </a>
              <span className="hidden sm:inline text-gray-400">|</span>
              <a
                href="mailto:help@propertifi.co"
                className="flex items-center text-propertifi-blue hover:text-propertifi-blue-dark font-semibold"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                help@propertifi.co
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-propertifi-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
