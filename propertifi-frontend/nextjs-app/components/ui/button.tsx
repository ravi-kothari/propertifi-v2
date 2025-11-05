import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Propertifi Blue (#2563EB)
        default:
          "bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg focus-visible:ring-primary-500",
        // Primary alias for clarity
        primary:
          "bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-lg focus-visible:ring-primary-500",
        // Secondary - Propertifi Orange (#F97316)
        secondary:
          "bg-secondary-500 text-white shadow-md hover:bg-secondary-600 hover:shadow-lg focus-visible:ring-secondary-400",
        // Outline - Border only with hover fill
        outline:
          "border-2 border-primary-600 bg-transparent text-primary-600 hover:bg-primary-600 hover:text-white focus-visible:ring-primary-500",
        // Ghost - Minimal styling with subtle hover
        ghost:
          "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        // Additional variants (kept from shadcn defaults)
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500",
        link:
          "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
