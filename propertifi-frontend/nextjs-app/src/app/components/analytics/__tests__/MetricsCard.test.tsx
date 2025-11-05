
import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricsCard from '../MetricsCard';

describe('MetricsCard', () => {
  it('renders the title and value', () => {
    render(<MetricsCard title="Total Leads" value={100} />);
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders the previous value when provided', () => {
    render(<MetricsCard title="Total Leads" value={100} previousValue={80} />);
    expect(screen.getByText('vs. 80 previous period')).toBeInTheDocument();
  });

  it('does not render the previous value when not provided', () => {
    render(<MetricsCard title="Total Leads" value={100} />);
    expect(screen.queryByText('vs.')).not.toBeInTheDocument();
  });
});
