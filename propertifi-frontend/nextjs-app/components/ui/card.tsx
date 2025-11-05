import * as React from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Propertifi Card Component
 * Enhanced with hover effects, featured badge support, and better responsive padding
 */

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow transition-all duration-200",
  {
    variants: {
      hover: {
        true: "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      hover: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  featured?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, featured, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ hover }), "relative", className)}
      {...props}
    >
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary-500 text-white shadow-md">
            ⭐ Featured
          </span>
        </div>
      )}
      {children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { image?: string }
>(({ className, image, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props}>
    {image && (
      <div className="w-full h-48 overflow-hidden rounded-t-xl relative">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
        />
      </div>
    )}
    <div className={cn("flex flex-col space-y-1.5", image ? "p-6" : "p-6")}>
      {children}
    </div>
  </div>
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-heading font-semibold leading-none tracking-tight text-lg", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-slate-600 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 pb-6", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center px-6 pb-6", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
