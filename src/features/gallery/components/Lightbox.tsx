"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/api/types";

type LightboxProps = {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
};

export const Lightbox = ({
  images,
  index,
  onClose,
  onNavigate,
}: LightboxProps) => {
  const current = images[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1)
        onNavigate(index + 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  if (!current) return null;

  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 w-12 h-12 bg-card/80 hover:bg-card rounded-full flex items-center justify-center text-foreground"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {hasPrev ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/80 hover:bg-card rounded-full flex items-center justify-center text-foreground"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      ) : null}

      {hasNext ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/80 hover:bg-card rounded-full flex items-center justify-center text-foreground"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      ) : null}

      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-7xl max-h-[90vh] flex flex-col items-center"
      >
        <img
          src={current.url}
          alt={current.alt}
          className="max-w-full max-h-[80vh] object-contain rounded-xl"
        />
        {current.title || current.caption ? (
          <div className="mt-4 text-center">
            {current.title ? (
              <p className="text-white text-xl font-bold">{current.title}</p>
            ) : null}
            {current.caption ? (
              <p className="text-gray-300 text-sm mt-1">{current.caption}</p>
            ) : null}
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground mt-2">
          {index + 1} / {images.length}
        </p>
      </div>
    </div>
  );
};
