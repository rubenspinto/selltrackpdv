"use client";

import { ComponentProps, forwardRef, useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, className = "", id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full space-y-1.5">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={`
              w-full px-4 py-3
              bg-gray-800/50 border border-gray-700
              rounded-xl text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
              transition-all duration-200
              ${error ? "border-red-500 focus:ring-red-500" : ""}
              ${isPassword ? "pr-12" : ""}
              ${className}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlash weight="bold" className="w-5 h-5" />
              ) : (
                <Eye weight="bold" className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
