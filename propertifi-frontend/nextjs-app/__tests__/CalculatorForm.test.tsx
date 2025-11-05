
import { render, screen } from '@testing-library/react';
import { CalculatorForm } from '@/components/calculators/CalculatorForm';
import { useForm, FormProvider } from 'react-hook-form';

const TestComponent = () => {
    const form = useForm();
    return (
        <FormProvider {...form}>
            <CalculatorForm />
        </FormProvider>
    )
}

describe('CalculatorForm', () => {
  it('renders all input fields', () => {
    render(<TestComponent />);

    expect(screen.getByLabelText(/Purchase Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Down Payment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Interest Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Loan Term/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Rent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vacancy Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Taxes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Insurance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/HOA Fees/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Maintenance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Management Fee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Other Expenses/i)).toBeInTheDocument();
  });
});
