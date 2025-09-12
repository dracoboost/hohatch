"use client";

// Added Image import
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import {useEffect, useState} from "react";

import {cn} from "@/lib/utils";

interface LightboxProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function Lightbox({images, isOpen, onClose, initialIndex = 0}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClose();
        }
      }}
    >
      {/* Close button */}
      <button
        aria-label="Close lightbox"
        className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            className="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            aria-label="Next image"
            className="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image container */}
      <div
        className="relative flex items-center justify-center"
        role="button"
        tabIndex={0}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`Slide ${currentIndex + 1} of ${images.length}`}
          className="max-h-[90vh] max-w-[90vw] object-contain"
          crossOrigin="anonymous"
          src={images[currentIndex] || "/images/placeholder.svg"}
        />
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail navigation */}
      {images.length > 1 && images.length <= 10 && (
        <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 transform gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "flex h-12 w-12 items-center justify-center overflow-hidden rounded border-2 transition-all",
                index === currentIndex
                  ? "scale-110 border-white"
                  : "border-white/50 hover:border-white/80",
              )}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
                src={image || "/images/placeholder.svg"}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
