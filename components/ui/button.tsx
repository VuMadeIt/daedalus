import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-card hover:bg-primaryDark",
        primary: "bg-primary px-8 py-2 text-white shadow-card hover:bg-primaryDark",
        destructive: "bg-error text-white hover:bg-error/90",
        outline:
          "border border-border bg-white text-textPrimary hover:border-black/15 hover:bg-backgroundMuted",
        secondary: "bg-ink text-white hover:bg-black",
        ghost: "text-textSecondary hover:bg-black/[0.04] hover:text-textPrimary",
        link: "text-primary underline-offset-4 hover:text-primaryDark hover:underline",
        auth: "rounded-full bg-primary text-white hover:bg-primaryDark",
        unstyled: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
      loading: {
        true: "cursor-wait opacity-70",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        {...props}
        aria-disabled={props.disabled || loading}
        disabled={props.disabled || loading}
        tabIndex={props.disabled || loading ? -1 : undefined}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
