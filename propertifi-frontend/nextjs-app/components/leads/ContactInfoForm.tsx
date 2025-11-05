/**
 * Contact Info Form Component
 * Form for capturing PM contact information
 */

'use client';

import { UseFormReturn } from 'react-hook-form';
import type { ContactInfoFormData } from '@/lib/validations/leadResponse';

interface ContactInfoFormProps {
  form: UseFormReturn<any>;
}

export default function ContactInfoForm({ form }: ContactInfoFormProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <label htmlFor="contact_info.phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            {...register('contact_info.phone')}
            type="tel"
            id="contact_info.phone"
            placeholder="(555) 123-4567"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.contact_info?.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contact_info.phone.message as string}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact_info.email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            {...register('contact_info.email')}
            type="email"
            id="contact_info.email"
            placeholder="pm@example.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.contact_info?.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contact_info.email.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Preferred Contact Time */}
      <div>
        <label htmlFor="contact_info.preferred_time" className="block text-sm font-medium text-gray-700">
          Preferred Contact Time
        </label>
        <select
          {...register('contact_info.preferred_time')}
          id="contact_info.preferred_time"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a time</option>
          <option value="morning">Morning (8am - 12pm)</option>
          <option value="afternoon">Afternoon (12pm - 5pm)</option>
          <option value="evening">Evening (5pm - 8pm)</option>
          <option value="anytime">Anytime</option>
        </select>
        {errors.contact_info?.preferred_time && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contact_info.preferred_time.message as string}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="contact_info.notes" className="block text-sm font-medium text-gray-700">
          Additional Notes (Optional)
        </label>
        <textarea
          {...register('contact_info.notes')}
          id="contact_info.notes"
          rows={3}
          placeholder="Any additional information you'd like to share..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.contact_info?.notes && (
          <p className="mt-1 text-sm text-red-600">
            {errors.contact_info.notes.message as string}
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> At least one contact method (phone or email) is required.
        </p>
      </div>
    </div>
  );
}
