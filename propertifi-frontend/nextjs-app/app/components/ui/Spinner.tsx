import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin rounded-full border-4 border-solid border-t-transparent", {
  variants: {
    color: {
      default: "border-primary",
      white: "border-white",
    },
    size: {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}

export function Spinner({ color, size }: SpinnerProps) {
  return <div className={cn(spinnerVariants({ color, size }))} />;
}
