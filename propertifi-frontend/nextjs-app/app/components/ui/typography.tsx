import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Propertifi Typography System
 *
 * A comprehensive typography component system using:
 * - Plus Jakarta Sans for headings (font-heading)
 * - Inter for body text (font-sans)
 *
 * All components support responsive sizing and proper semantic HTML.
 */

// ============================================================================
// HEADING COMPONENT
// ============================================================================

const headingVariants = cva(
  "font-heading font-bold text-slate-900 tracking-tight",
  {
    variants: {
      level: {
        h1: "text-4xl sm:text-5xl lg:text-6xl leading-tight",
        h2: "text-3xl sm:text-4xl lg:text-5xl leading-tight",
        h3: "text-2xl sm:text-3xl lg:text-4xl leading-snug",
        h4: "text-xl sm:text-2xl lg:text-3xl leading-snug",
        h5: "text-lg sm:text-xl lg:text-2xl leading-normal",
        h6: "text-base sm:text-lg lg:text-xl leading-normal",
      },
    },
    defaultVariants: {
      level: "h1",
    },
  }
);

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = "h1", as, children, ...props }, ref) => {
    const Comp = as || level;
    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ level }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Heading.displayName = "Heading";

// ============================================================================
// PARAGRAPH COMPONENT
// ============================================================================

const paragraphVariants = cva(
  "font-sans text-slate-700 leading-relaxed",
  {
    variants: {
      variant: {
        large: "text-lg sm:text-xl leading-relaxed",
        normal: "text-base leading-relaxed",
        small: "text-sm leading-relaxed",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  }
);

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(paragraphVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Paragraph.displayName = "Paragraph";

// ============================================================================
// LABEL COMPONENT
// ============================================================================

const labelVariants = cva(
  "font-sans font-medium text-slate-900 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        default: "text-sm",
        large: "text-base",
        small: "text-xs",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      required: false,
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ size, required }), className)}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

// ============================================================================
// CODE COMPONENT
// ============================================================================

const codeVariants = cva(
  "font-mono rounded px-1.5 py-0.5 font-medium",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-900 border border-slate-200",
        primary: "bg-primary-50 text-primary-700 border border-primary-200",
        secondary: "bg-secondary-50 text-secondary-700 border border-secondary-200",
      },
      size: {
        default: "text-sm",
        large: "text-base",
        small: "text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(codeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Code.displayName = "Code";

// ============================================================================
// ADDITIONAL UTILITY COMPONENTS
// ============================================================================

// Blockquote component for quotations
const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => {
  return (
    <blockquote
      ref={ref}
      className={cn(
        "border-l-4 border-primary-600 pl-6 italic text-slate-700 text-lg leading-relaxed",
        className
      )}
      {...props}
    />
  );
});
Blockquote.displayName = "Blockquote";

// List component
const List = React.forwardRef<
  HTMLUListElement | HTMLOListElement,
  React.HTMLAttributes<HTMLUListElement | HTMLOListElement> & { ordered?: boolean }
>(({ className, ordered = false, ...props }, ref) => {
  const Comp = ordered ? "ol" : "ul";
  return (
    <Comp
      ref={ref as any}
      className={cn(
        "space-y-2 text-slate-700",
        ordered ? "list-decimal list-inside" : "list-disc list-inside",
        className
      )}
      {...props}
    />
  );
});
List.displayName = "List";

// Lead text (larger intro paragraph)
const Lead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-xl sm:text-2xl text-slate-600 leading-relaxed font-light",
        className
      )}
      {...props}
    />
  );
});
Lead.displayName = "Lead";

// Muted text (smaller, less prominent)
const Muted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-slate-500 leading-relaxed", className)}
      {...props}
    />
  );
});
Muted.displayName = "Muted";

// ============================================================================
// EXPORTS
// ============================================================================

export {
  Heading,
  Paragraph,
  Label,
  Code,
  Blockquote,
  List,
  Lead,
  Muted,
  headingVariants,
  paragraphVariants,
  labelVariants,
  codeVariants,
};
