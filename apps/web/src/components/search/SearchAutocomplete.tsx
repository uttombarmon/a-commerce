"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, TrendingUp, Package, Tag, ArrowRight, CornerDownLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

interface SearchResults {
  products: Product[];
  categories: string[];
  brands: string[];
  popular: string[];
}

export function SearchAutocomplete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({ products: [], categories: [], brands: [], popular: [] });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>(null);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const saveSearch = useCallback((term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  }, [recentSearches]);

  // Handle Search
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults({ products: [], categories: [], brands: [], popular: ["Headphones", "Laptops", "Mechanical Keyboard"] });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce Input
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (query) {
      debounceTimer.current = setTimeout(() => performSearch(query), 300);
    } else {
      setResults({ products: [], categories: [], brands: [], popular: ["Headphones", "Laptops", "Mechanical Keyboard"] });
    }
    
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, performSearch]);

  const handleSelect = (term: string, type: "query" | "category" | "brand" = "query") => {
    saveSearch(term);
    setIsOpen(false);
    const url = type === "query" 
      ? `/search?q=${encodeURIComponent(term)}`
      : `/search?${type}=${encodeURIComponent(term.toLowerCase())}`;
    router.push(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) handleSelect(query);
  };

  // Keyboard Navigation — typed as discriminated union
  type FlatItem =
    | { label: string; type: "query" | "category" | "brand" }
    | { label: string; type: "product"; data: Product };

  const flatItems: FlatItem[] = [
    ...results.popular.map(p => ({ label: p, type: "query" as const })),
    ...results.categories.map(c => ({ label: c, type: "category" as const })),
    ...results.brands.map(b => ({ label: b, type: "brand" as const })),
    ...results.products.map(p => ({ label: p.title, type: "product" as const, data: p })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => Math.min(prev + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      const item = flatItems[selectedIndex];
      if (item.type === "product") {
        router.push(`/product/${item.data.id}`);
        setIsOpen(false);
      } else {
        handleSelect(item.label, item.type);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="search-container" ref={containerRef} onKeyDown={handleKeyDown}>
      <form onSubmit={handleSubmit} className="search-bar">
        <Search className="search-bar__icon" size={20} />
        <input
          type="text"
          placeholder="Search for items, brands, or categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="search-bar__input"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} className="search-bar__clear">
            <X size={16} />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="search-dropdown animate-in fade-in zoom-in-95 duration-200">
          
          <div className="search-dropdown__content scrollbar-hide">
            
            {/* ── Recent Searches ── */}
            {!query && recentSearches.length > 0 && (
              <section className="search-section">
                <h4 className="search-section__title"><Clock size={14} /> Recent Searches</h4>
                <div className="search-list">
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => handleSelect(s)} className="search-item group">
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-muted-foreground" />
                        <span>{s}</span>
                      </div>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-brand" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ── Popular / Trends ── */}
            {!query && results.popular.length > 0 && (
              <section className="search-section">
                <h4 className="search-section__title"><TrendingUp size={14} /> Trending Now</h4>
                <div className="flex flex-wrap gap-2">
                  {results.popular.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSelect(s)} 
                      className="px-4 py-2 bg-muted hover:bg-brand hover:text-white rounded-xl text-sm font-bold transition-all border border-transparent hover:shadow-lg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ── Categories & Brands ── */}
            {query && (results.categories.length > 0 || results.brands.length > 0) && (
              <div className="flex flex-col sm:flex-row gap-8 mb-8">
                {results.categories.length > 0 && (
                  <section className="flex-1">
                    <h4 className="search-section__title"><Package size={14} /> Categories</h4>
                    <div className="search-list">
                      {results.categories.map((c, i) => (
                        <button key={i} onClick={() => handleSelect(c, "category")} className="search-item group">
                          <span><span className="text-brand font-black">in</span> {c}</span>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                  </section>
                )}
                {results.brands.length > 0 && (
                  <section className="flex-1">
                    <h4 className="search-section__title"><Tag size={14} /> Brands</h4>
                    <div className="search-list">
                      {results.brands.map((b, i) => (
                        <button key={i} onClick={() => handleSelect(b, "brand")} className="search-item group">
                          <span>{b}</span>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* ── Product Suggestions ── */}
            {query && (
              <section className="search-section pt-6 border-t border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="search-section__title !mb-0">Product Results</h4>
                  {results.products.length > 0 && (
                    <span className="text-[10px] font-black text-brand uppercase tracking-widest">{results.products.length} items found</span>
                  )}
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[1,2,3,4].map(i => <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-2xl" />)}
                  </div>
                ) : results.products.length > 0 ? (
                  <div className="search-products">
                    {results.products.map((p, i) => {
                      const itemIndex = flatItems.findIndex(f => f.type === "product" && f.data.id === p.id);
                      return (
                        <Link 
                          key={p.id} 
                          href={`/product/${p.id}`} 
                          className={`search-product-item group ${selectedIndex === itemIndex ? 'bg-muted border-brand/30' : ''}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="search-product-item__img shadow-sm group-hover:scale-110 transition-transform">
                            <img src={p.image} alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate text-foreground group-hover:text-brand transition-colors">{p.title}</p>
                            <p className="text-xs font-bold text-muted-foreground mt-0.5">${p.price}</p>
                          </div>
                          <CornerDownLeft size={16} className={`opacity-0 group-hover:opacity-40 transition-opacity ${selectedIndex === itemIndex ? 'opacity-40' : ''}`} />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={24} className="text-muted-foreground opacity-30" />
                    </div>
                    <p className="text-sm font-black">No products found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try a different keyword or category</p>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="search-dropdown__footer">
            <span className="flex items-center gap-2"><kbd>↑↓</kbd> navigate</span>
            <span className="flex items-center gap-2"><kbd>↵</kbd> select</span>
            <span className="flex items-center gap-2 ml-auto opacity-50"><kbd>ESC</kbd> close</span>
          </div>
        </div>
      )}
    </div>
  );
}
