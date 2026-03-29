"use client";

import { ComponentProps, forwardRef } from "react";

interface TextAreaProps extends ComponentProps<"textarea"> {
  label: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          rows={3}
          className={`
            w-full px-4 py-3
            bg-gray-800/50 border border-gray-700
            rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            transition-all duration-200 resize-none
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
