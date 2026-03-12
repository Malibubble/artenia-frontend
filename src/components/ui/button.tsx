// src/components/ui/button.tsx
import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "sm" | "lg";
};

export function Button({
  variant = "default",
  size = "sm",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-cyan-400 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<string, string> = {
    default: "bg-[#00D9FF] text-black hover:bg-[#00D9FF]/80",
    outline:
      "border border-slate-500 text-slate-100 hover:bg-slate-800/60",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3 text-lg",
  };

  const classes = [
    base,
    variants[variant] ?? "",
    sizes[size] ?? "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}
