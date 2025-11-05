/**
 * Lead Response System Integration Tests
 * Tests the complete flow of the lead response system
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResponseForm from '@/components/leads/ResponseForm';
import ResponseHistory from '@/components/leads/ResponseHistory';
import LeadDetailModal from '@/components/leads/LeadDetailModal';

// Mock useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'pm@test.com', role: 'property_manager' },
    isLoading: false,
  }),
}));

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('Lead Response System', () => {
  describe('ResponseForm', () => {
    it('should display response type options', () => {
      render(
        <TestWrapper>
          <ResponseForm leadId={1} />
        </TestWrapper>
      );

      expect(screen.getByText('Share Contact Info')).toBeInTheDocument();
      expect(screen.getByText('Schedule Viewing')).toBeInTheDocument();
      expect(screen.getByText('Send Quote')).toBeInTheDocument();
      expect(screen.getByText('Not Interested')).toBeInTheDocument();
    });

    it('should show contact info form when selected', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ResponseForm leadId={1} />
        </TestWrapper>
      );

      const contactInfoButton = screen.getByRole('button', {
        name: /share contact info/i,
      });
      await user.click(contactInfoButton);

      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    it('should show availability form when selected', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ResponseForm leadId={1} />
        </TestWrapper>
      );

      const availabilityButton = screen.getByRole('button', {
        name: /schedule viewing/i,
      });
      await user.click(availabilityButton);

      expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/preferred time/i)).toBeInTheDocument();
    });

    it('should show price quote form when selected', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ResponseForm leadId={1} />
        </TestWrapper>
      );

      const quoteButton = screen.getByRole('button', {
        name: /send quote/i,
      });
      await user.click(quoteButton);

      expect(screen.getByLabelText(/management fee/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quote details/i)).toBeInTheDocument();
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ResponseForm leadId={1} />
        </TestWrapper>
      );

      // Select contact info
      const contactInfoButton = screen.getByRole('button', {
        name: /share contact info/i,
      });
      await user.click(contactInfoButton);

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', {
        name: /send response/i,
      });
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it('should submit contact info response successfully', async () => {
      const user = userEvent.setup();
      const onSuccess = jest.fn();

      render(
        <TestWrapper>
          <ResponseForm leadId={1} onSuccess={onSuccess} />
        </TestWrapper>
      );

      // Select contact info
      await user.click(screen.getByRole('button', { name: /share contact info/i }));

      // Fill in the form
      const messageField = screen.getByLabelText(/message to property owner/i);
      await user.type(
        messageField,
        'Hello! I would love to manage your property. I have 10 years of experience.'
      );

      const phoneField = screen.getByLabelText(/phone number/i);
      await user.type(phoneField, '5551234567');

      const emailField = screen.getByLabelText(/email address/i);
      await user.type(emailField, 'pm@example.com');

      // Submit
      const submitButton = screen.getByRole('button', { name: /send response/i });
      await user.click(submitButton);

      // Wait for success
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('ResponseHistory', () => {
    it('should show empty state when no responses', async () => {
      render(
        <TestWrapper>
          <ResponseHistory leadId={999} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/no responses yet/i)).toBeInTheDocument();
      });
    });

    it('should display response history', async () => {
      render(
        <TestWrapper>
          <ResponseHistory leadId={2} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/contact info shared/i)).toBeInTheDocument();
        expect(
          screen.getByText(/I'd be happy to manage your property/i)
        ).toBeInTheDocument();
      });
    });

    it('should show contact info details in history', async () => {
      render(
        <TestWrapper>
          <ResponseHistory leadId={2} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/555-111-2222/i)).toBeInTheDocument();
        expect(screen.getByText(/pm@example.com/i)).toBeInTheDocument();
      });
    });
  });

  describe('LeadDetailModal', () => {
    const mockLead = {
      id: 1,
      property_type: 'Single Family',
      street_address: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90001',
      number_of_units: 1,
      square_footage: 2000,
      additional_services: ['Maintenance'],
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      preferred_contact: 'email' as const,
      status: 'new' as const,
      viewed_at: null,
      responded_at: null,
      qualified_at: null,
      closed_at: null,
      archived_at: null,
      source: 'Website',
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-01-15T10:00:00Z',
    };

    it('should display lead details', () => {
      render(
        <TestWrapper>
          <LeadDetailModal lead={mockLead} isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );

      expect(screen.getByText('Single Family')).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should have three tabs', () => {
      render(
        <TestWrapper>
          <LeadDetailModal lead={mockLead} isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /details/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /respond/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument();
    });

    it('should switch to respond tab', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <LeadDetailModal lead={mockLead} isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );

      const respondTab = screen.getByRole('button', { name: /respond/i });
      await user.click(respondTab);

      // Should show response form
      expect(screen.getByText(/how would you like to respond/i)).toBeInTheDocument();
    });

    it('should switch to history tab', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <LeadDetailModal lead={mockLead} isOpen={true} onClose={() => {}} />
        </TestWrapper>
      );

      const historyTab = screen.getByRole('button', { name: /history/i });
      await user.click(historyTab);

      // Should show response history
      await waitFor(() => {
        expect(screen.getByText(/response history/i)).toBeInTheDocument();
      });
    });
  });
});
