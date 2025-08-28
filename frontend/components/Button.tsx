import React from "react";

import {cn} from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isDisabled?: boolean;
  variant?: "solid" | "bordered";
  color?: "primary" | "danger"; // For regular buttons
  isIconOnly?: boolean;
  isOverlay?: boolean; // For image overlay icon buttons
  buttonSize?: string; // New prop for button size
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isDisabled,
  variant = "solid",
  color,
  isIconOnly,
  isOverlay,
  className,
  buttonSize, // Destructure new prop
  ...props
}) => {
  const baseClasses =
    "inline-flex justify-center items-center rounded-full transition-colors duration-200";

  let buttonClasses = "";

  if (isIconOnly) {
    // Icon-only button styles
    buttonClasses = cn(
      baseClasses,
      buttonSize || "size-11", // Use buttonSize or default to size-11
      isOverlay
        ? // Image overlay icon-only button
          "bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-200"
        : // Other icon-only buttons (no background, with hover)
          "text-gray-700 dark:text-neutral-400 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-neutral-700 dark:hover:text-neutral-200",
      isDisabled && "opacity-50 cursor-not-allowed",
      className,
    );
  } else {
    // Regular button styles
    buttonClasses = cn(
      baseClasses,
      "px-4 py-2 font-semibold",
      variant === "solid" &&
        (color === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : color === "danger"
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/90"), // Default solid
      variant === "bordered" &&
        (color === "primary"
          ? "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          : color === "danger"
            ? "border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            : "border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"), // Default bordered
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
