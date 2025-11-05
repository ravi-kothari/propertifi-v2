import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Apply full width (no max-width constraint)
   */
  fluid?: boolean;
}

/**
 * Container Component
 *
 * A centered container with:
 * - Max width: 1280px (configurable with fluid prop)
 * - Responsive horizontal padding:
 *   - Mobile: 1rem (4 in Tailwind = 16px)
 *   - Tablet: 2rem (8 in Tailwind = 32px)
 *   - Desktop: 3rem (12 in Tailwind = 48px)
 * - Centered with mx-auto
 *
 * @example
 * ```tsx
 * <Container>
 *   <h1>Content goes here</h1>
 * </Container>
 *
 * // Full width variant
 * <Container fluid>
 *   <h1>Full width content</h1>
 * </Container>
 * ```
 */
export function Container({
  className,
  fluid = false,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-8 lg:px-12",
        !fluid && "max-w-container",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
