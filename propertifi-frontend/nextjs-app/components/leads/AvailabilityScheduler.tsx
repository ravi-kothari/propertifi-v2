/**
 * Availability Scheduler Component
 * Form for scheduling property viewings
 */

'use client';

import { UseFormReturn } from 'react-hook-form';
import type { AvailabilityFormData } from '@/lib/validations/leadResponse';

interface AvailabilitySchedulerProps {
  form: UseFormReturn<any>;
}

export default function AvailabilityScheduler({ form }: AvailabilitySchedulerProps) {
  const { register, formState: { errors } } = form;

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label htmlFor="availability.date" className="block text-sm font-medium text-gray-700">
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <input
            {...register('availability.date')}
            type="date"
            id="availability.date"
            min={today}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {(errors.availability as any)?.date && (
            <p className="mt-1 text-sm text-red-600">
              {(errors.availability as any).date.message as string}
            </p>
          )}
        </div>

        {/* Time */}
        <div>
          <label htmlFor="availability.time" className="block text-sm font-medium text-gray-700">
            Preferred Time <span className="text-red-500">*</span>
          </label>
          <input
            {...register('availability.time')}
            type="time"
            id="availability.time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {(errors.availability as any)?.time && (
            <p className="mt-1 text-sm text-red-600">
              {(errors.availability as any).time.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="availability.location" className="block text-sm font-medium text-gray-700">
          Meeting Location (Optional)
        </label>
        <input
          {...register('availability.location')}
          type="text"
          id="availability.location"
          placeholder="e.g., Property address, Coffee shop, Virtual meeting"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {(errors.availability as any)?.location && (
          <p className="mt-1 text-sm text-red-600">
            {(errors.availability as any).location.message as string}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="availability.notes" className="block text-sm font-medium text-gray-700">
          Additional Notes (Optional)
        </label>
        <textarea
          {...register('availability.notes')}
          id="availability.notes"
          rows={3}
          placeholder="Any special instructions or alternative times..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {(errors.availability as any)?.notes && (
          <p className="mt-1 text-sm text-red-600">
            {(errors.availability as any).notes.message as string}
          </p>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Tip:</strong> Propose a specific date and time to increase your chances of securing this lead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
