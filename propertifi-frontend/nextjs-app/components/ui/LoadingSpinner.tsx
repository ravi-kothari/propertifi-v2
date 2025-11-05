import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4',
};

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          'animate-spin rounded-full border-indigo-600 border-t-transparent',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label={label || 'Loading'}
      >
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
      {label && <p className="text-sm text-gray-600">{label}</p>}
    </div>
  );
}

export function PageLoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" label={label || 'Loading...'} />
    </div>
  );
}

export function FullPageLoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="xl" label={label || 'Loading...'} />
    </div>
  );
}
