import * as React from "react"
import { cn } from "@/lib/utils"
// I need to install @radix-ui/react-slot for 'asChild' support which is standard in shadcn-like setups.
// But I can implement a simpler button for now or install it. 
// I'll install it to be safe and standard.

// Actually, I'll stick to simple props for now to avoid extra installs unless needed. 
// Standard button without 'asChild' is fine for this scope.

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "accent" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
                        "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50": variant === "secondary",
                        "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
                        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
                        "text-primary underline-offset-4 hover:underline": variant === "link",
                        "bg-accent text-accent-foreground hover:bg-accent/90": variant === "accent",
                        "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-md px-3": size === "sm",
                        "h-11 rounded-md px-8": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
