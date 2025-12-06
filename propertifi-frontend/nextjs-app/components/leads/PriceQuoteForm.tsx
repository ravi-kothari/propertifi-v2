/**
 * Price Quote Form Component
 * Form for providing management fee quotes
 */

'use client';

import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import type { PriceQuoteFormData } from '@/lib/validations/leadResponse';

interface PriceQuoteFormProps {
  form: UseFormReturn<any>;
}

export default function PriceQuoteForm({ form }: PriceQuoteFormProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');

  const frequency = watch('price_quote.frequency');

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      const updated = [...services, newService.trim()];
      setServices(updated);
      setValue('price_quote.includes', updated);
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    const updated = services.filter(s => s !== service);
    setServices(updated);
    setValue('price_quote.includes', updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label htmlFor="price_quote.amount" className="block text-sm font-medium text-gray-700">
            Management Fee <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              {...register('price_quote.amount', { valueAsNumber: true })}
              type="number"
              id="price_quote.amount"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {(errors.price_quote as any)?.amount && (
            <p className="mt-1 text-sm text-red-600">
              {(errors.price_quote as any).amount.message as string}
            </p>
          )}
        </div>

        {/* Frequency */}
        <div>
          <label htmlFor="price_quote.frequency" className="block text-sm font-medium text-gray-700">
            Frequency <span className="text-red-500">*</span>
          </label>
          <select
            {...register('price_quote.frequency')}
            id="price_quote.frequency"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select frequency</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="one-time">One-time</option>
          </select>
          {(errors.price_quote as any)?.frequency && (
            <p className="mt-1 text-sm text-red-600">
              {(errors.price_quote as any).frequency.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      <div>
        <label htmlFor="price_quote.details" className="block text-sm font-medium text-gray-700">
          Quote Details <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('price_quote.details')}
          id="price_quote.details"
          rows={4}
          placeholder="Describe what's included in your management fee, your experience, and why you're the best choice..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {(errors.price_quote as any)?.details && (
          <p className="mt-1 text-sm text-red-600">
            {(errors.price_quote as any).details.message as string}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Minimum 10 characters. Be specific about services included.
        </p>
      </div>

      {/* Services Included */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Services Included (Optional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
            placeholder="e.g., Tenant screening, Maintenance coordination"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={addService}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Add
          </button>
        </div>

        {services.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {services.map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {service}
                <button
                  type="button"
                  onClick={() => removeService(service)}
                  className="hover:text-blue-900"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Valid Until */}
      <div>
        <label htmlFor="price_quote.valid_until" className="block text-sm font-medium text-gray-700">
          Quote Valid Until (Optional)
        </label>
        <input
          {...register('price_quote.valid_until')}
          type="date"
          id="price_quote.valid_until"
          min={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {(errors.price_quote as any)?.valid_until && (
          <p className="mt-1 text-sm text-red-600">
            {(errors.price_quote as any).valid_until.message as string}
          </p>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Pricing Tip:</strong> Be competitive but realistic. Consider the property size, services required, and local market rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
