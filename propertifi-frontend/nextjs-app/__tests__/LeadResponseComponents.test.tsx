/**
 * Lead Response Components Unit Tests
 * Tests individual components without API mocking
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContactInfoForm from '@/components/leads/ContactInfoForm';
import AvailabilityScheduler from '@/components/leads/AvailabilityScheduler';
import PriceQuoteForm from '@/components/leads/PriceQuoteForm';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { responseFormSchema } from '@/lib/validations/leadResponse';

// Test wrapper with React Hook Form
function TestFormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      response_type: 'contact_info',
      message: '',
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

// Wrapper component for React Query
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('Lead Response Components', () => {
  describe('ContactInfoForm', () => {
    it('should render phone and email fields', () => {
      const methods = useForm();

      render(
        <TestWrapper>
          <ContactInfoForm form={methods} />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/preferred contact time/i)).toBeInTheDocument();
    });

    it('should show validation note about required contact method', () => {
      const methods = useForm();

      render(
        <TestWrapper>
          <ContactInfoForm form={methods} />
        </TestWrapper>
      );

      expect(
        screen.getByText(/at least one contact method.*is required/i)
      ).toBeInTheDocument();
    });

    it('should have preferred time options', () => {
      const methods = useForm();

      render(
        <TestWrapper>
          <ContactInfoForm form={methods} />
        </TestWrapper>
      );

      const select = screen.getByLabelText(/preferred contact time/i);
      expect(select).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /morning/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /afternoon/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /evening/i })).toBeInTheDocument();
    });
  });

  describe('AvailabilityScheduler', () => {
    it('should render date and time fields', () => {
      const methods = useForm();

      render(
        <TestWrapper>
          <AvailabilityScheduler form={methods} />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/preferred time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/meeting location/i)).toBeInTheDocument();
    });

    it('should show tip about proposing specific time', () => {
      const methods = useForm();

      render(
        <TestWrapper>
          <AvailabilityScheduler form={methods} />
        </TestWrapper>
      );

      expect(
        screen.getByText(/propose a specific date and time/i)
      ).toBeInTheDocument();
    });

    it('date field should have min date of today', () => {
      const methods = useForm();
      const today = new Date().toISOString().split('T')[0];

      render(
        <TestWrapper>
          <AvailabilityScheduler form={methods} />
        </TestWrapper>
      );

      const dateInput = screen.getByLabelText(/preferred date/i) as HTMLInputElement;
      expect(dateInput.min).toBe(today);
    });
  });

  describe('PriceQuoteForm', () => {
    it('should render amount and frequency fields', () => {
      const methods = useForm();

      render(
        <TestWrapper>
          <PriceQuoteForm form={methods} />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/management fee/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quote details/i)).toBeInTheDocument();
    });

    it('should have frequency options', () => {
      const methods = useForm();

      render(
        <TestWrapper>
          <PriceQuoteForm form={methods} />
        </TestWrapper>
      );

      expect(screen.getByRole('option', { name: /monthly/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /yearly/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /one-time/i })).toBeInTheDocument();
    });

    it('should show pricing tip', () => {
      const methods = useForm();

      render(
        <TestWrapper>
          <PriceQuoteForm form={methods} />
        </TestWrapper>
      );

      expect(
        screen.getByText(/be competitive but realistic/i)
      ).toBeInTheDocument();
    });

    it('should allow adding services', async () => {
      const user = userEvent.setup();
      const methods = useForm();

      render(
        <TestWrapper>
          <PriceQuoteForm form={methods} />
        </TestWrapper>
      );

      const serviceInput = screen.getByPlaceholderText(/tenant screening/i);
      await user.type(serviceInput, 'Maintenance Coordination');

      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Maintenance Coordination')).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation Schemas', () => {
    it('should validate contact info requires phone or email', () => {
      const { contactInfoSchema } = require('@/lib/validations/leadResponse');

      // Should fail with neither phone nor email
      const result1 = contactInfoSchema.safeParse({});
      expect(result1.success).toBe(false);

      // Should pass with phone
      const result2 = contactInfoSchema.safeParse({ phone: '5551234567' });
      expect(result2.success).toBe(true);

      // Should pass with email
      const result3 = contactInfoSchema.safeParse({ email: 'test@example.com' });
      expect(result3.success).toBe(true);

      // Should pass with both
      const result4 = contactInfoSchema.safeParse({
        phone: '5551234567',
        email: 'test@example.com',
      });
      expect(result4.success).toBe(true);
    });

    it('should validate email format', () => {
      const { contactInfoSchema } = require('@/lib/validations/leadResponse');

      const result = contactInfoSchema.safeParse({ email: 'notanemail' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email');
      }
    });

    it('should validate availability requires date and time', () => {
      const { availabilitySchema } = require('@/lib/validations/leadResponse');

      // Should fail without date
      const result1 = availabilitySchema.safeParse({ time: '10:00' });
      expect(result1.success).toBe(false);

      // Should fail without time
      const result2 = availabilitySchema.safeParse({ date: '2025-02-01' });
      expect(result2.success).toBe(false);

      // Should pass with both
      const result3 = availabilitySchema.safeParse({
        date: '2025-02-01',
        time: '10:00',
      });
      expect(result3.success).toBe(true);
    });

    it('should validate price quote amount is positive', () => {
      const { priceQuoteSchema } = require('@/lib/validations/leadResponse');

      // Should fail with negative amount
      const result1 = priceQuoteSchema.safeParse({
        amount: -100,
        frequency: 'monthly',
        details: 'Test details that are long enough',
      });
      expect(result1.success).toBe(false);

      // Should pass with positive amount
      const result2 = priceQuoteSchema.safeParse({
        amount: 2000,
        frequency: 'monthly',
        details: 'Test details that are long enough',
      });
      expect(result2.success).toBe(true);
    });

    it('should validate quote details minimum length', () => {
      const { priceQuoteSchema } = require('@/lib/validations/leadResponse');

      // Should fail with short details
      const result = priceQuoteSchema.safeParse({
        amount: 2000,
        frequency: 'monthly',
        details: 'Short',
      });
      expect(result.success).toBe(false);
    });
  });
});
