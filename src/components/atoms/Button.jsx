import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    destructive: "bg-gradient-to-r from-error-500 to-error-600 text-white hover:from-error-600 hover:to-error-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    outline: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 transform hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 transform hover:scale-[1.02] active:scale-[0.98]",
    link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;