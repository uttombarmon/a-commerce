import { NextResponse } from "next/server";
import { MOCK_PRODUCTS, RELATED_PRODUCTS } from "@/lib/mock-products";
import type { ProductDetail } from "@/types/product";

// Simulate database search logic
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : 0;
  const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : Infinity;
  const categoriesParam = searchParams.get("categories");
  const brandsParam = searchParams.get("brands");
  const sort = searchParams.get("sort") || "relevance";

  const selectedCategories = categoriesParam ? categoriesParam.split(",") : [];
  const selectedBrands = brandsParam ? brandsParam.split(",") : [];

  const q = searchParams.get("q")?.toLowerCase() || "";

  if (!q && !categoriesParam && !brandsParam) {
    return NextResponse.json({
      products: [],
      categories: [],
      brands: [],
      popular: ["Headphones", "Mechanical Keyboard", "Gaming Mouse", "Monitor 4K"],
    });
  }

  // Combine full ProductDetail records with lightweight related products
  const richProducts: ProductDetail[] = Object.values(MOCK_PRODUCTS);
  const allItems = [
    ...richProducts,
    ...RELATED_PRODUCTS,
  ];

  // 1. Product Search & Filter
  let productMatches = allItems.filter((p: any) => {
    // Text Match
    const matchesQuery = !q || p.title.toLowerCase().includes(q) || 
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q));
      
    // Price Match
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    
    // Category Match
    const matchesCategory = selectedCategories.length === 0 || (p.category && selectedCategories.includes(p.category));
    
    // Brand Match
    const matchesBrand = selectedBrands.length === 0 || (p.brand && selectedBrands.includes(p.brand));

    return matchesQuery && matchesPrice && matchesCategory && matchesBrand;
  });

  // 2. Sort Logic
  if (sort === "price_asc") {
    productMatches.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    productMatches.sort((a, b) => b.price - a.price);
  }
  // If 'newest' or 'relevance', we leave as is for mock

  const finalProducts = productMatches.slice(0, 24).map((p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.image,
    brand: p.brand,
    category: p.category,
    rating: (p as any).rating || 4.5,
    reviews: (p as any).reviews || 120
  }));

  // 3. Facets Generation (for sidebar)
  const uniqueCategories = Array.from(new Set(allItems.map((p: any) => p.category).filter(Boolean))) as string[];
  const uniqueBrands = Array.from(new Set(allItems.map((p: any) => p.brand).filter(Boolean))) as string[];

  // Artificial delay for testing
  await new Promise(r => setTimeout(r, 200));

  return NextResponse.json({
    products: finalProducts,
    categories: uniqueCategories,
    brands: uniqueBrands,
    popular: [],
    total: productMatches.length
  });
}
