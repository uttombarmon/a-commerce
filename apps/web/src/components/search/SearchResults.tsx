"use client";

import { useState } from "react";
import { Grid, List, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/types/product";

interface SearchResultsProps {
  products: Product[];
  query?: string;
  total?: number;
}

export function SearchResults({ products, query, total = 0 }: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const view = (searchParams.get("view") as "grid" | "list") || "grid";
  const [loading, setLoading] = useState(false);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Get active filters from URL
  const activeBrand = searchParams.get("brand");
  const activeRating = searchParams.get("rating");
  const activeCategory = searchParams.get("category");

  const appliedFilters = [
    ...(activeBrand ? [{ id: "brand", label: activeBrand, type: "brand" }] : []),
    ...(activeRating ? [{ id: "rating", label: `${activeRating}★ & Up`, type: "rating" }] : []),
    ...(activeCategory ? [{ id: "category", label: activeCategory, type: "category" }] : []),
  ];

  return (
    <main className="plp-main">
      <header className="plp-header">
        <div className="plp-header__top">
          <div className="plp-results-info">
            {query ? (
              <h1>
                Results for <span className="text-pdp-accent">"{query}"</span>
              </h1>
            ) : (
              <h1>All Products</h1>
            )}
            <span>1-{products.length} of {total} results</span>
          </div>

          <div className="plp-controls">
            <select 
              className="plp-sort"
              onChange={(e) => updateParams("sort", e.target.value)}
              value={searchParams.get("sort") || ""}
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            <div className="layout-toggle">
              <button 
                className={`layout-btn ${view === "grid" ? "layout-btn--active" : ""}`}
                onClick={() => updateParams("view", "grid")}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`layout-btn ${view === "list" ? "layout-btn--active" : ""}`}
                onClick={() => updateParams("view", "list")}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="plp-chips">
          {appliedFilters.map((filter) => (
            <div key={filter.id} className="chip capitalize">
              {filter.label}
              <button 
                className="chip__clear"
                onClick={() => removeParam(filter.id)}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {appliedFilters.length > 0 && (
            <button 
              className="text-xs font-bold text-pdp-accent hover:underline"
              onClick={() => router.push(pathname)}
            >
              Clear all
            </button>
          )}
        </div>
      </header>

      {/* Grid / List */}
      <div className={`plp-grid ${view === "list" ? "plp-grid--list" : ""}`}>
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-[350px] w-full" />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-xl font-bold">No products found</p>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        )}
      </div>

      {/* Pagination */}
      <nav className="plp-pagination" aria-label="Pagination">
        <button className="page-btn">←</button>
        {[1, 2, 3, "...", 10].map((page, i) => (
          <button 
            key={i} 
            className={`page-btn ${page === 1 ? "page-btn--active" : ""}`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
        <button className="page-btn">→</button>
      </nav>
    </main>
  );
}
