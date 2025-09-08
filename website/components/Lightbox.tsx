"use client";

import Image from "next/image";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";

interface LightboxContextType {
  openLightbox: (src: string) => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

interface LightboxProviderProps {
  children: React.ReactNode;
}

export const Lightbox: React.FC<LightboxProviderProps> = ({children}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);

  const openLightbox = useCallback((src: string) => {
    setCurrentImage(src);
    setIsLightboxOpen(true);
    setIsZoomed(false);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setCurrentImage("");
  }, []);

  const toggleZoom = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed((prev) => !prev);
  }, []);

  // Close lightbox on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    };
    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, closeLightbox]);

  const handleBackgroundClick = useCallback(() => {
    if (isZoomed) {
      setIsZoomed(false);
    } else {
      closeLightbox();
    }
  }, [isZoomed, closeLightbox]);

  return (
    <LightboxContext.Provider value={{openLightbox}}>
      {children}

      {isLightboxOpen && (
        <div
          className={`bg-opacity-80 fixed inset-0 z-50 bg-black p-4 transition-all duration-300 ${
            isZoomed ? "overflow-auto" : "flex items-center justify-center"
          }`}
          role="button"
          tabIndex={0}
          onClick={handleBackgroundClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleBackgroundClick();
            }
          }}
        >
          <button
            aria-label="Close Lightbox"
            className="fixed top-4 right-4 z-[51] cursor-pointer p-2 text-3xl font-bold text-white"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            &times;
          </button>
          <div className={`relative ${isZoomed ? "m-auto" : "w-full max-w-4xl"}`}>
            <Image
              alt="Lightbox view"
              className={
                isZoomed
                  ? "h-auto max-h-none w-auto max-w-none cursor-zoom-out"
                  : "h-auto max-h-[90vh] w-full cursor-zoom-in rounded-lg object-contain shadow-xl"
              }
              height={1080}
              src={currentImage}
              width={1920}
              onClick={toggleZoom}
            />
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (context === undefined) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
};
