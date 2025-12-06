/**
 * Response Form Component
 * Main form for submitting responses to leads
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { responseFormSchema, type ResponseFormData } from '@/lib/validations/leadResponse';
import { useSubmitResponse } from '@/hooks/useLeadResponse';
import ContactInfoForm from './ContactInfoForm';
import AvailabilityScheduler from './AvailabilityScheduler';
import PriceQuoteForm from './PriceQuoteForm';
import type { ResponseType } from '@/types/leads';

interface ResponseFormProps {
  leadId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RESPONSE_TYPES: { value: ResponseType; label: string; description: string; icon: string }[] = [
  {
    value: 'contact_info',
    label: 'Share Contact Info',
    description: 'Provide your contact details for the property owner',
    icon: '📞',
  },
  {
    value: 'availability',
    label: 'Schedule Viewing',
    description: 'Propose a time to view the property',
    icon: '📅',
  },
  {
    value: 'price_quote',
    label: 'Send Quote',
    description: 'Provide a management fee quote',
    icon: '💰',
  },
  {
    value: 'decline',
    label: 'Not Interested',
    description: "Politely decline this opportunity",
    icon: '👋',
  },
];

export default function ResponseForm({ leadId, onSuccess, onCancel }: ResponseFormProps) {
  const [selectedType, setSelectedType] = useState<ResponseType | null>(null);

  const form = useForm<any>({
    resolver: zodResolver(responseFormSchema) as any,
    defaultValues: {
      response_type: undefined,
      message: '',
    },
  });

  const { mutate: submitResponse, isPending, isError, error } = useSubmitResponse(leadId);

  const handleTypeSelect = (type: ResponseType) => {
    setSelectedType(type);
    form.setValue('response_type', type);
  };

  const onSubmit = (data: ResponseFormData) => {
    submitResponse(data, {
      onSuccess: () => {
        form.reset();
        setSelectedType(null);
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Response Type Selection */}
      {!selectedType ? (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">How would you like to respond?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESPONSE_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeSelect(type.value)}
                className="relative rounded-lg border-2 border-gray-300 bg-white p-4 hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left transition-all"
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-3">{type.icon}</span>
                  <div>
                    <p className="text-base font-medium text-gray-900">{type.label}</p>
                    <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Selected Type Header */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">
                {RESPONSE_TYPES.find(t => t.value === selectedType)?.icon}
              </span>
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  {RESPONSE_TYPES.find(t => t.value === selectedType)?.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {RESPONSE_TYPES.find(t => t.value === selectedType)?.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedType(null);
                form.reset();
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Change
            </button>
          </div>

          {/* Message Field (always shown) */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message to Property Owner <span className="text-red-500">*</span>
            </label>
            <textarea
              {...form.register('message')}
              id="message"
              rows={4}
              placeholder="Introduce yourself and explain your interest in managing this property..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {form.formState.errors.message && (
              <p className="mt-1 text-sm text-red-600">
                {(form.formState.errors.message as any)?.message}
              </p>
            )}
          </div>

          {/* Conditional Form Fields */}
          {selectedType === 'contact_info' && <ContactInfoForm form={form} />}
          {selectedType === 'availability' && <AvailabilityScheduler form={form} />}
          {selectedType === 'price_quote' && <PriceQuoteForm form={form} />}
          {selectedType === 'decline' && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-sm text-gray-700">
                Your message will let the property owner know you're not interested at this time.
                This lead will be marked as declined.
              </p>
            </div>
          )}

          {/* Error Message */}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error instanceof Error ? error.message : 'Failed to submit response. Please try again.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Response'
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
