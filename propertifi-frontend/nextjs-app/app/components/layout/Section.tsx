import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

const sectionVariants = cva("w-full", {
  variants: {
    /**
     * Vertical padding variants
     */
    spacing: {
      none: "py-0",
      sm: "py-8 sm:py-12",
      md: "py-12 sm:py-16 lg:py-20",
      lg: "py-16 sm:py-20 lg:py-24",
      xl: "py-20 sm:py-24 lg:py-32",
    },
    /**
     * Background color variants
     */
    variant: {
      default: "bg-white",
      slate: "bg-slate-50",
      primary: "bg-primary-50",
      secondary: "bg-secondary-50",
      dark: "bg-slate-900 text-white",
      gradient: "bg-gradient-to-br from-primary-600 to-primary-700 text-white",
    },
  },
  defaultVariants: {
    spacing: "md",
    variant: "default",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /**
   * Render children without Container wrapper
   */
  noContainer?: boolean;
  /**
   * Apply full width container (no max-width)
   */
  fluid?: boolean;
}

/**
 * Section Component
 *
 * A semantic section wrapper with:
 * - Configurable vertical padding (spacing prop)
 * - Background color variants
 * - Optional Container wrapper (enabled by default)
 * - Full width support
 *
 * @example
 * ```tsx
 * // Default section with container
 * <Section>
 *   <h2>Section Title</h2>
 *   <p>Content here</p>
 * </Section>
 *
 * // Large spacing with slate background
 * <Section spacing="lg" variant="slate">
 *   <h2>Hero Section</h2>
 * </Section>
 *
 * // No container wrapper (full width control)
 * <Section noContainer variant="dark">
 *   <div className="custom-layout">
 *     <h2>Custom Layout</h2>
 *   </div>
 * </Section>
 * ```
 */
export function Section({
  className,
  spacing,
  variant,
  noContainer = false,
  fluid = false,
  children,
  ...props
}: SectionProps) {
  const content = noContainer ? (
    children
  ) : (
    <Container fluid={fluid}>{children}</Container>
  );

  return (
    <section
      className={cn(sectionVariants({ spacing, variant }), className)}
      {...props}
    >
      {content}
    </section>
  );
}
