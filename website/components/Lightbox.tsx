"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

interface LightboxContextType {
  openLightbox: (src: string) => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

interface LightboxProviderProps {
  children: React.ReactNode;
}

export const Lightbox: React.FC<LightboxProviderProps> = ({ children }) => {
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
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}

      {isLightboxOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-80 z-50 p-4 transition-all duration-300 ${
            isZoomed ? "overflow-auto" : "flex items-center justify-center"
          }`}
          onClick={handleBackgroundClick}
        >
          <button
            className="fixed top-4 right-4 text-white text-3xl font-bold p-2 z-[51] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Close Lightbox"
          >
            &times;
          </button>
          <div
            className={`relative ${
              isZoomed ? "m-auto" : "w-full max-w-4xl"
            }`}
          >
            <Image
              src={currentImage}
              alt="Lightbox view"
              className={
                isZoomed
                  ? "max-w-none max-h-none w-auto h-auto cursor-zoom-out"
                  : "w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-xl cursor-zoom-in"
              }
              onClick={toggleZoom}
              width={1920}
              height={1080}
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

