import { Check } from "lucide-react";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function FormProgress({ currentStep, totalSteps, steps }: FormProgressProps) {
  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-200">
          <div
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-500"
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  isCompleted
                    ? "bg-green-600 text-white"
                    : isCurrent
                    ? "bg-primary-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{stepNumber}</span>
                )}
              </div>
              <span
                className={`text-xs sm:text-sm text-center ${
                  isCurrent ? "font-semibold text-slate-900" : "text-slate-500"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
