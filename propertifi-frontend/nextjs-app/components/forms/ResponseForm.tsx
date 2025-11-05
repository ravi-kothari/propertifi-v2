'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubmitResponse } from '@/hooks/useLeads';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InlineError } from '@/components/ui/ErrorMessage';
import type { Lead, ResponseType, SubmitResponseRequest } from '@/types/leads';

interface ResponseFormProps {
  lead: Lead;
  onSubmit: (leadId: number, data: any) => void;
  onCancel: () => void;
}

// Schema for basic response
const baseResponseSchema = z.object({
  response_type: z.enum(['contact_info', 'availability', 'price_quote', 'decline']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Schema for contact info response
const contactInfoSchema = baseResponseSchema.extend({
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional(),
  preferred_time: z.string().optional(),
  contact_notes: z.string().optional(),
});

// Schema for availability response
const availabilitySchema = baseResponseSchema.extend({
  availability_date: z.string().min(1, 'Date is required'),
  availability_time: z.string().min(1, 'Time is required'),
  availability_location: z.string().optional(),
  availability_notes: z.string().optional(),
});

// Schema for price quote response
const priceQuoteSchema = baseResponseSchema.extend({
  quote_amount: z.string().min(1, 'Amount is required'),
  quote_frequency: z.enum(['monthly', 'yearly', 'one-time']),
  quote_details: z.string().min(1, 'Details are required'),
  quote_includes: z.string().optional(),
  quote_valid_until: z.string().optional(),
});

export default function ResponseForm({ lead, onSubmit, onCancel }: ResponseFormProps) {
  const [responseType, setResponseType] = useState<ResponseType>('contact_info');
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitResponse = useSubmitResponse();

  // Determine which schema to use based on response type
  const getSchema = () => {
    switch (responseType) {
      case 'contact_info':
        return contactInfoSchema;
      case 'availability':
        return availabilitySchema;
      case 'price_quote':
        return priceQuoteSchema;
      case 'decline':
        return baseResponseSchema;
      default:
        return baseResponseSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      response_type: 'contact_info',
      message: '',
    },
  });

  const handleFormSubmit = async (data: any) => {
    setApiError(null);

    try {
      // Build the request payload based on response type
      const requestData: SubmitResponseRequest = {
        response_type: data.response_type,
        message: data.message,
      };

      // Add type-specific data
      if (data.response_type === 'contact_info') {
        requestData.contact_info = {
          phone: data.contact_phone,
          email: data.contact_email,
          preferred_time: data.preferred_time,
          notes: data.contact_notes,
        };
      } else if (data.response_type === 'availability') {
        requestData.availability = {
          date: data.availability_date,
          time: data.availability_time,
          location: data.availability_location,
          notes: data.availability_notes,
        };
      } else if (data.response_type === 'price_quote') {
        requestData.price_quote = {
          amount: parseFloat(data.quote_amount),
          frequency: data.quote_frequency,
          details: data.quote_details,
          includes: data.quote_includes ? data.quote_includes.split(',').map((s: string) => s.trim()) : undefined,
          valid_until: data.quote_valid_until,
        };
      }

      // Submit to API
      await submitResponse.mutateAsync({
        leadId: lead.id,
        data: requestData,
      });

      setSuccessMessage('Response sent successfully!');
      onSubmit(lead.id, requestData);

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (error: any) {
      setApiError(error.message || 'Failed to send response. Please try again.');
    }
  };

  const handleResponseTypeChange = (newType: ResponseType) => {
    setResponseType(newType);
    reset();
  };

  if (successMessage) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg
          className="h-16 w-16 text-green-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-medium text-gray-900">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Lead Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">{lead.full_name}</h3>
        <p className="text-sm text-gray-600">{lead.property_type}</p>
        <p className="text-sm text-gray-600">
          {lead.street_address}, {lead.city}, {lead.state} {lead.zip_code}
        </p>
      </div>

      {/* Response Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Response Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleResponseTypeChange('contact_info')}
            className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              responseType === 'contact_info'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Share Contact Info
          </button>
          <button
            type="button"
            onClick={() => handleResponseTypeChange('availability')}
            className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              responseType === 'availability'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Schedule Meeting
          </button>
          <button
            type="button"
            onClick={() => handleResponseTypeChange('price_quote')}
            className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              responseType === 'price_quote'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Send Quote
          </button>
          <button
            type="button"
            onClick={() => handleResponseTypeChange('decline')}
            className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              responseType === 'decline'
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Decline
          </button>
        </div>
        <input type="hidden" {...register('response_type')} value={responseType} />
      </div>

      {/* Message Field (Common to all types) */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write your message to the property owner..."
        />
        {errors.message && (
          <InlineError message={errors.message.message as string} />
        )}
      </div>

      {/* Contact Info Fields */}
      {responseType === 'contact_info' && (
        <div className="space-y-4 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-medium text-gray-900">Contact Information</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="contact_phone"
                {...register('contact_phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="contact_email"
                {...register('contact_email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700 mb-1">
              Best Time to Contact
            </label>
            <input
              type="text"
              id="preferred_time"
              {...register('preferred_time')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Weekdays 9am-5pm"
            />
          </div>

          <div>
            <label htmlFor="contact_notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="contact_notes"
              {...register('contact_notes')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any additional information..."
            />
          </div>
        </div>
      )}

      {/* Availability Fields */}
      {responseType === 'availability' && (
        <div className="space-y-4 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-medium text-gray-900">Meeting Details</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="availability_date" className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="availability_date"
                {...register('availability_date')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.availability_date && (
                <InlineError message={errors.availability_date.message as string} />
              )}
            </div>

            <div>
              <label htmlFor="availability_time" className="block text-sm font-medium text-gray-700 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="availability_time"
                {...register('availability_time')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.availability_time && (
                <InlineError message={errors.availability_time.message as string} />
              )}
            </div>
          </div>

          <div>
            <label htmlFor="availability_location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="availability_location"
              {...register('availability_location')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Meeting location or video call link"
            />
          </div>

          <div>
            <label htmlFor="availability_notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="availability_notes"
              {...register('availability_notes')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any additional details..."
            />
          </div>
        </div>
      )}

      {/* Price Quote Fields */}
      {responseType === 'price_quote' && (
        <div className="space-y-4 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-medium text-gray-900">Quote Details</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quote_amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  id="quote_amount"
                  {...register('quote_amount')}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
              {errors.quote_amount && (
                <InlineError message={errors.quote_amount.message as string} />
              )}
            </div>

            <div>
              <label htmlFor="quote_frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                id="quote_frequency"
                {...register('quote_frequency')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-time</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="quote_details" className="block text-sm font-medium text-gray-700 mb-1">
              Service Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="quote_details"
              {...register('quote_details')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe what's included in this quote..."
            />
            {errors.quote_details && (
              <InlineError message={errors.quote_details.message as string} />
            )}
          </div>

          <div>
            <label htmlFor="quote_includes" className="block text-sm font-medium text-gray-700 mb-1">
              Included Services (comma-separated)
            </label>
            <input
              type="text"
              id="quote_includes"
              {...register('quote_includes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Tenant screening, Maintenance, 24/7 support"
            />
          </div>

          <div>
            <label htmlFor="quote_valid_until" className="block text-sm font-medium text-gray-700 mb-1">
              Quote Valid Until
            </label>
            <input
              type="date"
              id="quote_valid_until"
              {...register('quote_valid_until')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="rounded-md bg-red-50 p-4">
          <InlineError message={apiError} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={submitResponse.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={submitResponse.isPending}
        >
          {submitResponse.isPending && <LoadingSpinner size="sm" />}
          {submitResponse.isPending ? 'Sending...' : 'Send Response'}
        </button>
      </div>
    </form>
  );
}
