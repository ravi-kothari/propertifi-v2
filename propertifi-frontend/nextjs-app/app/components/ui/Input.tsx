"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputWrapperVariants = cva("relative w-full", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const inputVariants = cva(
  "flex w-full rounded-lg border bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 shadow-sm transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 text-sm",
        md: "h-10 text-base",
        lg: "h-12 text-lg",
      },
      state: {
        default:
          "border-slate-300 dark:border-slate-600 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20",
        error:
          "border-red-500 dark:border-red-500 focus-visible:border-red-600 focus-visible:ring-2 focus-visible:ring-red-500/20",
        success:
          "border-green-500 dark:border-green-500 focus-visible:border-green-600 focus-visible:ring-2 focus-visible:ring-green-500/20",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

const labelVariants = cva(
  "block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300",
  {
    variants: {
      state: {
        default: "",
        error: "text-red-600 dark:text-red-400",
        success: "text-green-600 dark:text-green-400",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

/**
 * Enhanced Input Component
 *
 * A comprehensive input component with support for:
 * - Labels and helper text
 * - Error and success states
 * - Left and right icons
 * - Different sizes (sm, md, lg)
 * - Disabled state
 * - Dark mode support
 *
 * @example
 * ```tsx
 * // Basic input with label
 * <Input label="Email" type="email" placeholder="you@example.com" />
 *
 * // Input with error state
 * <Input
 *   label="Password"
 *   type="password"
 *   state="error"
 *   errorMessage="Password must be at least 8 characters"
 * />
 *
 * // Input with left icon
 * <Input
 *   label="Search"
 *   leftIcon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 *
 * // Large input with helper text
 * <Input
 *   label="Full Name"
 *   size="lg"
 *   helperText="Enter your first and last name"
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size = "md",
      state,
      label,
      helperText,
      errorMessage,
      successMessage,
      leftIcon,
      rightIcon,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine the actual state based on messages
    const actualState = errorMessage
      ? "error"
      : successMessage
        ? "success"
        : state || "default";

    // Determine message to display
    const message = errorMessage || successMessage || helperText;

    // Calculate padding for icons
    const paddingLeft = leftIcon
      ? size === "sm"
        ? "pl-9"
        : size === "lg"
          ? "pl-12"
          : "pl-10"
      : "";
    const paddingRight = rightIcon
      ? size === "sm"
        ? "pr-9"
        : size === "lg"
          ? "pr-12"
          : "pr-10"
      : "";

    return (
      <div className={inputWrapperVariants({ size })}>
        {label && (
          <label className={labelVariants({ state: actualState })}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={cn(
                "absolute left-0 top-0 h-full flex items-center justify-center text-slate-400 dark:text-slate-500 pointer-events-none",
                size === "sm" ? "w-9" : size === "lg" ? "w-12" : "w-10"
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            type={type}
            className={cn(
              inputVariants({ size, state: actualState }),
              paddingLeft,
              paddingRight,
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={actualState === "error" ? "true" : "false"}
            aria-describedby={
              message ? `${props.id}-message` : undefined
            }
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div
              className={cn(
                "absolute right-0 top-0 h-full flex items-center justify-center text-slate-400 dark:text-slate-500",
                size === "sm" ? "w-9" : size === "lg" ? "w-12" : "w-10"
              )}
            >
              {rightIcon}
            </div>
          )}

          {/* State Icons (automatic) */}
          {!rightIcon && actualState === "error" && (
            <div
              className={cn(
                "absolute right-0 top-0 h-full flex items-center justify-center text-red-500 pointer-events-none",
                size === "sm" ? "w-9" : size === "lg" ? "w-12" : "w-10"
              )}
            >
              <svg
                className={size === "sm" ? "w-4 h-4" : "w-5 h-5"}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}

          {!rightIcon && actualState === "success" && (
            <div
              className={cn(
                "absolute right-0 top-0 h-full flex items-center justify-center text-green-500 pointer-events-none",
                size === "sm" ? "w-9" : size === "lg" ? "w-12" : "w-10"
              )}
            >
              <svg
                className={size === "sm" ? "w-4 h-4" : "w-5 h-5"}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Helper/Error/Success Text */}
        {message && (
          <p
            id={props.id ? `${props.id}-message` : undefined}
            className={cn(
              "mt-1.5 text-sm",
              actualState === "error" &&
                "text-red-600 dark:text-red-400",
              actualState === "success" &&
                "text-green-600 dark:text-green-400",
              actualState === "default" &&
                "text-slate-500 dark:text-slate-400"
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
