
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLeadResponse } from '@/app/hooks/useLeadResponse';

const ResponseForm = ({ leadId }: { leadId: string }) => {
  const { register, handleSubmit, watch } = useForm();
  const responseType = watch('responseType');
  const mutation = useLeadResponse();

  const onSubmit = (data: any) => {
    mutation.mutate({ ...data, leadId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Response Type</label>
        <select {...register('responseType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="interested">Interested</option>
          <option value="not_interested">Not Interested</option>
          <option value="need_more_info">Need More Info</option>
          <option value="contact_requested">Contact Requested</option>
        </select>
      </div>

      {responseType === 'interested' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea {...register('message')} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      )}

      <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Submit Response
      </button>
    </form>
  );
};

export default ResponseForm;
