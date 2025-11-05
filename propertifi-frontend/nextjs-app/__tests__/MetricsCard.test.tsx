
import { render, screen } from '@testing-library/react';
import { MetricsCard } from '@/components/analytics/MetricsCard';

describe('MetricsCard', () => {
  it('renders the title and value', () => {
    render(<MetricsCard title="Total Leads" value={125} />);

    const titleElement = screen.getByText(/Total Leads/i);
    const valueElement = screen.getByText(/125/i);

    expect(titleElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
  });
});
