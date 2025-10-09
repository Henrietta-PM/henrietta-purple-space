import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-350 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary/80 text-white hover:bg-primary rounded-[2rem] backdrop-blur-md border-0.5 border-primary/40 shadow-[0_12px_48px_0_rgba(0,0,0,0.08),0_4px_24px_0_rgba(0,0,0,0.04),inset_0_2px_4px_0_rgba(255,255,255,0.12)] hover:shadow-[0_16px_56px_0_rgba(0,0,0,0.12),0_6px_28px_0_rgba(0,0,0,0.06),inset_0_2px_4px_0_rgba(255,255,255,0.16)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-[2rem] shadow-[0_12px_48px_0_rgba(0,0,0,0.08),0_4px_24px_0_rgba(0,0,0,0.04),inset_0_2px_4px_0_rgba(255,255,255,0.12)] hover:shadow-[0_16px_56px_0_rgba(0,0,0,0.12),0_6px_28px_0_rgba(0,0,0,0.06)]",
        outline: "glass border-0.5 border-primary/20 text-foreground dark:text-primary-visible hover:bg-primary/10 rounded-[2rem]",
        secondary: "glass text-foreground dark:text-white border-0.5 border-primary/30 dark:border-white/20 hover:bg-primary/10 dark:hover:bg-white/10 rounded-[2rem]",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-[2rem]",
        link: "text-primary-visible underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
