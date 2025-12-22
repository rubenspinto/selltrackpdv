"use client";

import { ComponentProps } from "react";
import { CircleNotch } from "@phosphor-icons/react";

type ButtonVariant = "primary" | "secondary";

interface FormButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:bg-emerald-600/50 disabled:hover:bg-emerald-600/50 disabled:shadow-none",
  secondary:
    "border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:border-gray-700 disabled:text-gray-500 disabled:hover:bg-transparent",
};

export function FormButton({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: FormButtonProps) {
  return (
    <button
      className={`
        w-full inline-flex items-center justify-center
        px-8 py-3.5
        font-semibold text-base
        rounded-xl
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900
        disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <CircleNotch weight="bold" className="w-5 h-5 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
