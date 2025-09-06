"use client";

import React from "react";

import {cn} from "@/lib/utils";

interface UnderlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  errorMessage?: string;
  label: string;
  readOnly?: boolean;
  startContent?: React.ReactNode;
}

export const FloatingUnderlineInput: React.FC<UnderlineInputProps> = ({
  className,
  containerClassName,
  errorMessage,
  id,
  label,
  readOnly,
  startContent,
  ...props
}) => {
  const inputId = id || (label ? `underline-input-${label.replace(/\s+/g, "-")}` : undefined);
  const hasError = !!errorMessage;

  return (
    <div className={cn("relative w-full", containerClassName)}>
      <div className="relative">
        {startContent && (
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center peer-disabled:opacity-50">
            {startContent}
          </div>
        )}
        {/* Input */}
        <input
          className={cn(
            "peer block w-full border-0 border-b bg-transparent pb-2",
            startContent ? "ps-8" : "ps-0",
            "placeholder:text-transparent focus:ring-0 focus:outline-none disabled:pointer-events-none disabled:opacity-50 sm:text-sm",
            "focus:pt-6 focus:pb-2",
            "autofill:pt-6 autofill:pb-2",
            "not-placeholder-shown:pt-6 not-placeholder-shown:pb-2",
            hasError ? "border-b-red-500" : "border-b-gray-500 dark:border-b-neutral-500",
            readOnly && "cursor-not-allowed opacity-50",
            className,
          )}
          disabled={readOnly}
          id={inputId}
          placeholder={label}
          {...props}
        />
        {/* Label */}
        {label && (
          <label
            className={cn(
              "pointer-events-none absolute start-0 top-1 h-full origin-[0_0] truncate border border-transparent transition-all duration-100 ease-in-out",
              startContent ? "ps-8" : "ps-0",
              "px-0 py-2 sm:text-sm",
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
        )}
        {/* Animated underline */}
        <div
          className={cn(
            "absolute bottom-0 left-0 h-0.5 w-full origin-center scale-x-0 transform transition-transform duration-200 ease-out peer-focus:scale-x-100",
            hasError
              ? "bg-red-500"
              : readOnly
                ? "bg-gray-500 dark:bg-neutral-500"
                : "bg-hochan-red",
          )}
        />
      </div>
      {errorMessage && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};
