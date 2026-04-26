import { Suspense } from "react";
import type { Metadata } from "next";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { SearchResults } from "@/components/search/SearchResults";
import { MOCK_PRODUCTS, RELATED_PRODUCTS } from "@/lib/mock-products";
import type { Product } from "@/types/product";
import "../plp.css";

export const metadata: Metadata = {
  title: "Search Results — ACommerce",
  description: "Browse thousands of products on ACommerce Marketplace.",
};

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").toLowerCase();
  const category = (typeof params.category === "string" ? params.category : "").toLowerCase();
  const brand = (typeof params.brand === "string" ? params.brand : "").toLowerCase();
  const rating = typeof params.rating === "string" ? parseInt(params.rating) : 0;

  // Combine all mock data into one pool
  const allProducts: Product[] = [
    ...Object.values(MOCK_PRODUCTS),
    ...RELATED_PRODUCTS,
  ];

  // Filter products
  const filteredProducts = allProducts.filter((p) => {
    const matchesQuery = !query || p.title.toLowerCase().includes(query);
    const matchesCategory = !category || p.category?.toLowerCase() === category;
    const matchesBrand = !brand || p.brand?.toLowerCase() === brand || p.sellerName?.toLowerCase() === brand;
    const matchesRating = !rating || p.rating >= rating;
    return matchesQuery && matchesCategory && matchesBrand && matchesRating;
  });

  return (
    <div className="plp-page bg-background min-h-screen">
      <div className="plp-container">
        {/* Sidebar Filters */}
        <Suspense fallback={<div className="skeleton w-full h-[600px]" />}>
          <FilterSidebar />
        </Suspense>

        {/* Main Content */}
        <Suspense fallback={<div className="skeleton w-full h-[800px]" />}>
          <SearchResults 
            products={filteredProducts} 
            query={query} 
            total={filteredProducts.length} 
          />
        </Suspense>
      </div>
    </div>
  );
}
