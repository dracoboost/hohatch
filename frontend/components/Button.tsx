import React from "react";

import {cn} from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isDisabled?: boolean;
  variant?: "solid" | "bordered" | "ghost";
  color?: "default" | "primary" | "danger" | "secondary";
  size?: "sm" | "md" | "lg";
  isIconOnly?: boolean;
  isOverlay?: boolean;
  buttonSize?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isDisabled,
  variant = "solid",
  color = "default",
  size = "md",
  isIconOnly,
  isOverlay,
  className,
  buttonSize,
  ...props
}) => {
  const baseClasses =
    "inline-flex justify-center items-center rounded-xl transition-colors duration-200 font-semibold";

  let buttonClasses = "";

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Define classes for each color based on the variant
  const solidClasses = {
    default:
      "text-gray-900 bg-slate-400/50 hover:text-gray-900/50 hover:bg-slate-400/30 dark:text-white dark:bg-gray-100/50 dark:hover:text-white/50 dark:hover:bg-gray-100/30",
    primary: "bg-sky-500 text-white hover:bg-sky-600",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    secondary: "bg-hochan-red text-white hover:bg-hochan-red/80",
  };

  const ghostClasses = {
    default: "text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700",
    primary: "text-sky-500 hover:bg-sky-500/10",
    danger: "text-rose-500 hover:bg-rose-500/10",
    secondary: "text-hochan-red hover:bg-hochan-red/10",
  };

  if (isIconOnly) {
    // Icon-only button styles
    buttonClasses = cn(
      baseClasses,
      buttonSize || "size-11",
      isOverlay
        ? // Image overlay icon-only button
          "bg-gray-100 dark:bg-neutral-700"
        : // Other icon-only buttons (no background, with hover)
          "hover:bg-white dark:hover:bg-neutral-700",
      isDisabled && "opacity-50 cursor-not-allowed",
      className,
    );
  } else {
    // Regular button styles
    let variantClass = "";
    if (variant === "solid") {
      variantClass = solidClasses[color];
    } else if (variant === "ghost") {
      variantClass = ghostClasses[color];
    } else if (variant === "bordered") {
      // for now, let's just handle solid and ghost
      variantClass = `${solidClasses[color]} bg-transparent border border-current`;
    }

    buttonClasses = cn(
      baseClasses,
      sizeClasses[size],
      variantClass,
      isDisabled && "opacity-50 cursor-not-allowed",
      className,
    );
  }

  return (
    <button className={buttonClasses} disabled={isDisabled} {...props}>
      {children}
    </button>
  );
};
