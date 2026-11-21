import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex max-h-[500px] min-h-[80px] w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-textPrimary shadow-sm ring-offset-background placeholder:text-textMuted focus-visible:outline-hidden focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
