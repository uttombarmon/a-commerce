"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/types/product";

export function RelatedProducts({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="pdp-related" aria-label="Related products">
      <div className="pdp-related__header">
        <h2 className="pdp-related__title">You Might Also Like</h2>
        <div className="pdp-related__nav" aria-label="Scroll related products">
          <button
            onClick={() => scroll("left")}
            className="pdp-related__nav-btn"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="pdp-related__nav-btn"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="pdp-related__scroll no-scrollbar"
        role="list"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="pdp-related__item"
            role="listitem"
          >
            <ProductCard {...p} />
          </div>
        ))}
      </div>
    </section>
  );
}
