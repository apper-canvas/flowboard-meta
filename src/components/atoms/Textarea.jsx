import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;