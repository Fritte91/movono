"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "movono-toast",
          description: "movono-toast-description",
          actionButton: "movono-toast-action",
          cancelButton: "movono-toast-cancel",
        },
        duration: 5000,
      }}
      {...props}
    />
  )
}

export { Toaster }
