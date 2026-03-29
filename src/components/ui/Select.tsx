"use client";

import { ComponentProps, forwardRef } from "react";

interface SelectProps extends ComponentProps<"select"> {
  label: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={id}
          className={`
            w-full px-4 py-3
            bg-gray-800/50 border border-gray-700
            rounded-xl text-white
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            transition-all duration-200
            appearance-none cursor-pointer
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-sm text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
