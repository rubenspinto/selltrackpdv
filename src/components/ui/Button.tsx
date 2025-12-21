import Link from "next/link";
import { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
  secondary:
    "border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <Link
      className={`
        inline-flex items-center justify-center
        px-8 py-3.5
        font-semibold text-base
        rounded-xl
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Link>
  );
}
