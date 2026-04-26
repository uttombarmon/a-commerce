"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { ProductImage } from "@/types/product";

interface ImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export function ImageGallery({ images, productTitle }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    },
    []
  );

  const prev = () => setActiveIdx((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setActiveIdx((i) => (i < images.length - 1 ? i + 1 : 0));

  const active = images[activeIdx];

  return (
    <div className="pdp-gallery">
      {/* Main Image */}
      <div
        ref={mainRef}
        className={`pdp-gallery__main ${zoomed ? "pdp-gallery__main--zoomed" : ""}`}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        aria-label="Product image — hover to zoom"
      >
        <Image
          src={active.url}
          alt={active.alt}
          fill
          priority={activeIdx === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="pdp-gallery__img"
          style={
            zoomed
              ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: "scale(2)",
                  transition: "transform 0.1s ease",
                }
              : { transform: "scale(1)", transition: "transform 0.3s ease" }
          }
        />

        {/* Zoom hint */}
        {!zoomed && (
          <div className="pdp-gallery__zoom-hint" aria-hidden="true">
            <ZoomIn size={14} />
            <span>Hover to zoom</span>
          </div>
        )}

        {/* Mobile arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="pdp-gallery__arrow pdp-gallery__arrow--prev"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="pdp-gallery__arrow pdp-gallery__arrow--next"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="pdp-gallery__counter" aria-label={`Image ${activeIdx + 1} of ${images.length}`}>
          {activeIdx + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="pdp-gallery__thumbs" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.id}
              role="tab"
              aria-selected={i === activeIdx}
              onClick={() => setActiveIdx(i)}
              className={`pdp-gallery__thumb ${i === activeIdx ? "pdp-gallery__thumb--active" : ""}`}
              aria-label={img.alt}
            >
              <Image
                src={img.thumb}
                alt={img.alt}
                fill
                sizes="80px"
                className="object-cover rounded-xl"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
