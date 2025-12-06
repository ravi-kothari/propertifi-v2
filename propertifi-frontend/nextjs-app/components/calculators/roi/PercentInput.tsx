import React from 'react';

interface PercentInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function PercentInput({
  label,
  value,
  onChange,
  error,
  helpText,
  disabled = false,
  required = false,
  min = 0,
  max = 100,
  step = 0.1,
  className = '',
}: PercentInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>(value.toString());
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value.toString());
    }
  }, [value, isFocused]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Parse and validate the input
    const numericValue = parseFloat(displayValue);
    if (!isNaN(numericValue)) {
      let finalValue = numericValue;
      if (min !== undefined && finalValue < min) finalValue = min;
      if (max !== undefined && finalValue > max) finalValue = max;
      onChange(finalValue);
      setDisplayValue(finalValue.toString());
    } else {
      // Reset to previous valid value
      setDisplayValue(value.toString());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow only numbers and decimal points
    const sanitized = inputValue.replace(/[^\d.]/g, '');
    setDisplayValue(sanitized);
  };

  const inputId = `percent-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`${className}`}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="text"
          id={inputId}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`block w-full rounded-md border-gray-300 pr-8 pl-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="0"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm">%</span>
        </div>
      </div>
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
