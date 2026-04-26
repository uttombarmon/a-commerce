"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { ProductGrid } from "@/components/search/ProductGrid";
import { Loader2, ChevronDown } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch data whenever URL params change
    fetch(`/api/search?${searchParams.toString()}`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      });
  }, [searchParams]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "relevance";
  const query = searchParams.get("q") || "";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {query ? `Search Results for "${query}"` : "All Products"}
        </h1>
        {data && (
          <p className="text-muted-foreground mt-2">
            Showing {data.products.length} of {data.total || data.products.length} results
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <FilterSidebar 
            categories={data?.categories || []} 
            brands={data?.brands || []} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Top Bar */}
          <div className="flex justify-end mb-6 bg-white border border-border p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-muted-foreground">Sort By:</span>
              <div className="relative">
                <select 
                  value={currentSort}
                  onChange={handleSort}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-muted rounded-lg text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-brand"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="animate-spin text-brand" size={48} />
            </div>
          ) : (
            <ProductGrid products={data?.products || []} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Suspense fallback={<div className="flex justify-center p-24"><Loader2 className="animate-spin" /></div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
