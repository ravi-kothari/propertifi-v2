import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridVariants = cva("grid w-full", {
  variants: {
    /**
     * Number of columns on desktop
     */
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
      6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
    },
    /**
     * Gap between grid items
     */
    gap: {
      none: "gap-0",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12",
    },
  },
  defaultVariants: {
    cols: 3,
    gap: "md",
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

/**
 * Grid Component
 *
 * A responsive grid layout with:
 * - 1 column on mobile (default)
 * - 2 columns on tablet (md breakpoint)
 * - 3-6 columns on desktop (lg breakpoint) - configurable
 * - Configurable gap spacing
 *
 * Responsive breakpoints:
 * - Mobile: 1 column (default)
 * - Tablet (md: 768px): 2 columns (or 3 for 6-col grid)
 * - Desktop (lg: 1024px): 3-6 columns based on cols prop
 *
 * @example
 * ```tsx
 * // Default 3-column grid
 * <Grid>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 *
 * // 4-column grid with large gap
 * <Grid cols={4} gap="lg">
 *   <Card>Card 1</Card>
 *   <Card>Card 2</Card>
 *   <Card>Card 3</Card>
 *   <Card>Card 4</Card>
 * </Grid>
 *
 * // 2-column grid with small gap
 * <Grid cols={2} gap="sm">
 *   <div>Left</div>
 *   <div>Right</div>
 * </Grid>
 * ```
 */
export function Grid({ className, cols, gap, children, ...props }: GridProps) {
  return (
    <div className={cn(gridVariants({ cols, gap }), className)} {...props}>
      {children}
    </div>
  );
}
