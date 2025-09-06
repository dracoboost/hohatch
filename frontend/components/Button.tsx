import React from "react";

import {cn} from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isDisabled?: boolean;
  variant?: "solid" | "bordered";
  isIconOnly?: boolean;
  isOverlay?: boolean;
  buttonSize?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isDisabled,
  variant = "solid",
  isIconOnly,
  isOverlay,
  className,
  buttonSize,
  ...props
}) => {
  const baseClasses =
    "inline-flex justify-center items-center rounded-full transition-colors duration-200";

  let buttonClasses = "";

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
    buttonClasses = cn(
      baseClasses,
      "px-4 py-2 font-semibold text-gray-900 bg-hochan-navy-blue/50 hover:text-gray-900/50 hover:bg-hochan-navy-blue/30 dark:text-white dark:bg-gray-100/50 dark:hover:text-white/50 dark:hover:bg-gray-100/30",
      variant === "bordered" && "border border-hochan-navy-blue dark:border-gray-100",
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
