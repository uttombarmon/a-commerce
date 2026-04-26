import { NextResponse } from "next/server";
import { MOCK_PRODUCTS, RELATED_PRODUCTS } from "@/lib/mock-products";
import type { Product } from "@/types/product";

// Simulate database search logic
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  
  if (!q) {
    return NextResponse.json({
      products: [],
      categories: [],
      brands: [],
      popular: ["Headphones", "Mechanical Keyboard", "Gaming Mouse", "Monitor 4K"],
    });
  }

  const allProducts: Product[] = [
    ...Object.values(MOCK_PRODUCTS),
    ...RELATED_PRODUCTS,
  ];

  // 1. Product Search (Full-text simulation + Fuzzy)
  const productMatches = allProducts.filter((p) => 
    p.title.toLowerCase().includes(q) || 
    p.category?.toLowerCase().includes(q) ||
    p.brand?.toLowerCase().includes(q)
  ).slice(0, 5);

  // 2. Category Suggestions
  const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean))) as string[];
  const categoryMatches = uniqueCategories
    .filter(cat => cat.toLowerCase().includes(q))
    .slice(0, 3);

  // 3. Brand Suggestions
  const uniqueBrands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean))) as string[];
  const brandMatches = uniqueBrands
    .filter(brand => brand.toLowerCase().includes(q))
    .slice(0, 3);

  // Simulate analytics logging
  if (productMatches.length === 0) {
    console.log(`[Search Analytics] No results for query: "${q}"`);
  } else {
    console.log(`[Search Analytics] Logged query: "${q}" (${productMatches.length} results)`);
  }

  // Artificial delay for debounce testing
  await new Promise(r => setTimeout(r, 100));

  return NextResponse.json({
    products: productMatches,
    categories: categoryMatches,
    brands: brandMatches,
    popular: [],
  });
}
