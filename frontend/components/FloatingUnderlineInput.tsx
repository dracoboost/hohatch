"use client";

import React from "react";

import {cn} from "@/lib/utils";

interface FloatingUnderlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  startContent?: React.ReactNode;
  errorMessage?: string;
}

export const FloatingUnderlineInput: React.FC<FloatingUnderlineInputProps> = ({
  label,
  startContent,
  id,
  className,
  errorMessage,
  ...props
}) => {
  const inputId = id || `floating-input-${label.replace(/\s+/g, "-")}`;
  const hasError = !!errorMessage;

  return (
    <div className="relative w-full">
      <div className="relative">
        {startContent && (
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2 peer-disabled:opacity-50">
            {startContent}
          </div>
        )}
        <input
          className={cn(
            "peer block w-full border-0 border-b bg-transparent px-0 py-4", // border-b for static line
            startContent ? "ps-8" : "ps-0",
            "placeholder:text-transparent focus:ring-0 focus:outline-none disabled:pointer-events-none disabled:opacity-50 sm:text-sm",
            "focus:pt-6 focus:pb-2",
            "autofill:pt-6 autofill:pb-2",
            "not-placeholder-shown:pt-6 not-placeholder-shown:pb-2",
            hasError ? "border-b-red-500" : "border-b-gray-300 dark:border-b-neutral-700",
            className,
          )}
          id={inputId}
          placeholder={label}
          {...props}
        />
        <label
          className={cn(
            "pointer-events-none absolute start-0 top-0 h-full origin-[0_0] truncate border border-transparent transition-all duration-100 ease-in-out",
            startContent ? "ps-8" : "ps-0",
            "px-0 py-4 sm:text-sm",
            "peer-disabled:pointer-events-none peer-disabled:opacity-50",
            "peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:scale-90",
            "peer-not-placeholder-shown:translate-x-0.5 peer-not-placeholder-shown:-translate-y-1.5 peer-not-placeholder-shown:scale-90",
            hasError
              ? "text-red-500 dark:text-red-500"
              : "text-gray-500 peer-focus:text-gray-500 dark:text-neutral-500 dark:peer-not-placeholder-shown:text-neutral-500 dark:peer-focus:text-neutral-500",
          )}
          htmlFor={inputId}
        >
          {label}
        </label>
        {/* Animated underline */}
        <div
          className={cn(
            "absolute bottom-0 left-0 h-0.5 w-full origin-center scale-x-0 transform bg-sky-500 transition-transform duration-200 ease-out peer-focus:scale-x-100",
            hasError ? "bg-red-500" : "bg-sky-500",
          )}
        />
      </div>
      {errorMessage && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};
