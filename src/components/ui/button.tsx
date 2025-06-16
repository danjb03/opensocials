
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white text-black border border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg",
        destructive:
          "bg-red-600 text-white border border-red-700 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg",
        outline:
          "border border-gray-600 bg-transparent text-foreground hover:bg-gray-900 hover:border-gray-500 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md",
        secondary:
          "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md",
        ghost: "text-foreground hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] rounded-full",
        link: "text-primary underline-offset-4 hover:underline hover:scale-[1.02] active:scale-[0.98] rounded-none",
        connect: "bg-black text-white border border-gray-700 hover:bg-gray-900 hover:border-gray-600 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg rounded-full px-6 py-3 font-medium before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:content-['']",
        custom: "",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-full px-4",
        lg: "h-12 rounded-full px-8",
        icon: "h-10 w-10",
        connect: "h-12 px-6 py-3 text-base",
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
  showArrow?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, showArrow = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Show arrow by default for connect variant, but only if not using asChild
    const shouldShowArrow = !asChild && (showArrow || variant === "connect")
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {shouldShowArrow && <ArrowRight className="h-4 w-4" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
