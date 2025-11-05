"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"

const ToastIcon = ({ variant }: { variant?: string | null }) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-6 w-6 text-white" />
    case "destructive":
      return <XCircle className="h-6 w-6 text-white" />
    case "warning":
      return <AlertTriangle className="h-6 w-6 text-white" />
    case "info":
      return <Info className="h-6 w-6 text-white" />
    default:
      return null
  }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start space-x-4">
              <ToastIcon variant={variant} />
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
