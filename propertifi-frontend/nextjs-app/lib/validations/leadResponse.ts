/**
 * Lead Response Validation Schemas
 * Zod schemas for validating lead response forms
 */

import { z } from 'zod';

// ============================================================================
// Contact Info Schema
// ============================================================================

export const contactInfoSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  email: z.string().email('Invalid email address').optional(),
  preferred_time: z.string().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
}).refine(
  (data) => data.phone || data.email,
  {
    message: 'At least one contact method (phone or email) is required',
    path: ['phone'],
  }
);

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

// ============================================================================
// Availability Schema
// ============================================================================

export const availabilitySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export type AvailabilityFormData = z.infer<typeof availabilitySchema>;

// ============================================================================
// Price Quote Schema
// ============================================================================

export const priceQuoteSchema = z.object({
  amount: z.number().min(0, 'Amount must be positive').or(
    z.string().min(1, 'Amount is required').transform((val) => parseFloat(val))
  ),
  frequency: z.enum(['monthly', 'yearly', 'one-time']),
  details: z.string().min(10, 'Please provide details about your quote').max(1000),
  includes: z.array(z.string()).optional(),
  valid_until: z.string().optional(),
});

export type PriceQuoteFormData = z.infer<typeof priceQuoteSchema>;

// ============================================================================
// Main Response Schema
// ============================================================================

export const responseFormSchema = z.object({
  response_type: z.enum(['contact_info', 'availability', 'price_quote', 'decline']),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  contact_info: contactInfoSchema.optional(),
  availability: availabilitySchema.optional(),
  price_quote: priceQuoteSchema.optional(),
});

export type ResponseFormData = z.infer<typeof responseFormSchema>;

// ============================================================================
// Conditional Validation Helper
// ============================================================================

export function validateResponseForm(data: ResponseFormData) {
  // Validate that required fields are present based on response_type
  switch (data.response_type) {
    case 'contact_info':
      if (!data.contact_info) {
        throw new Error('Contact information is required for this response type');
      }
      contactInfoSchema.parse(data.contact_info);
      break;
    case 'availability':
      if (!data.availability) {
        throw new Error('Availability information is required for this response type');
      }
      availabilitySchema.parse(data.availability);
      break;
    case 'price_quote':
      if (!data.price_quote) {
        throw new Error('Price quote information is required for this response type');
      }
      priceQuoteSchema.parse(data.price_quote);
      break;
    case 'decline':
      // Only message is required for decline
      break;
  }

  return responseFormSchema.parse(data);
}
