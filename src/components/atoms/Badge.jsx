import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary-50 text-primary-700 border border-primary-200",
    secondary: "bg-gray-100 text-gray-700 border border-gray-200",
    destructive: "bg-error-50 text-error-700 border border-error-200",
    outline: "text-gray-700 border border-gray-200",
    success: "bg-success-50 text-success-700 border border-success-200",
    warning: "bg-warning-50 text-warning-700 border border-warning-200",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;