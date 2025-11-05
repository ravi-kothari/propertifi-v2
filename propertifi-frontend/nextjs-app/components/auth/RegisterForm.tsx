'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ValidationError, ApiClientError } from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  password_confirmation: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setApiError(null);
      setFieldErrors({});

      await registerUser(
        values.name,
        values.email,
        values.password,
        values.password_confirmation
      );

      // Redirect to dashboard after successful registration
      router.push('/property-manager');
    } catch (error) {
      if (error instanceof ValidationError) {
        // Handle field-level validation errors from API
        const errors: Record<string, string> = {};
        Object.entries(error.errors || {}).forEach(([field, messages]) => {
          errors[field] = messages[0]; // Take first error message
        });
        setFieldErrors(errors);
        setApiError('Please check the errors below');
      } else if (error instanceof ApiClientError) {
        // Handle general API errors
        setApiError(error.message || 'Registration failed. Please try again.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
        console.error('Registration error:', error);
      }
    }
  };

  const isFormLoading = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full name
        </label>
        <div className="mt-1">
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            disabled={isFormLoading}
          />
        </div>
        {(errors.name || fieldErrors.name) && (
          <p className="mt-2 text-sm text-red-600">
            {errors.name?.message || fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            disabled={isFormLoading}
          />
        </div>
        {(errors.email || fieldErrors.email) && (
          <p className="mt-2 text-sm text-red-600">
            {errors.email?.message || fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            disabled={isFormLoading}
          />
        </div>
        {(errors.password || fieldErrors.password) && (
          <p className="mt-2 text-sm text-red-600">
            {errors.password?.message || fieldErrors.password}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Must be at least 8 characters with one uppercase letter and one number
        </p>
      </div>

      <div>
        <label
          htmlFor="password_confirmation"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm password
        </label>
        <div className="mt-1">
          <input
            id="password_confirmation"
            type="password"
            autoComplete="new-password"
            {...register('password_confirmation')}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            disabled={isFormLoading}
          />
        </div>
        {(errors.password_confirmation || fieldErrors.password_confirmation) && (
          <p className="mt-2 text-sm text-red-600">
            {errors.password_confirmation?.message || fieldErrors.password_confirmation}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isFormLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFormLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </button>
      </div>

      <div className="text-sm text-center">
        <span className="text-gray-600">Already have an account? </span>
        <a
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </a>
      </div>
    </form>
  );
}
