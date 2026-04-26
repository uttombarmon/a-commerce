"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
}

export function FilterSidebar({ categories, brands }: FilterSidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategories = searchParams.get("categories")?.split(",") || [];
  const selectedBrands = searchParams.get("brands")?.split(",") || [];
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const toggleFilter = (type: "categories" | "brands", value: string) => {
    const current = type === "categories" ? selectedCategories : selectedBrands;
    const isSelected = current.includes(value);
    
    let newValues;
    if (isSelected) {
      newValues = current.filter(item => item !== value);
    } else {
      newValues = [...current, value];
    }
    
    router.push(`${pathname}?${createQueryString(type, newValues.join(","))}`);
  };

  const applyPrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const min = formData.get("min") as string;
    const max = formData.get("max") as string;
    
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min); else params.delete("minPrice");
    if (max) params.set("maxPrice", max); else params.delete("maxPrice");
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-border">
        <SlidersHorizontal size={20} />
        Filters
      </div>

      <div className="space-y-8">
        {/* Price Filter */}
        <div>
          <h3 className="font-bold mb-4">Price Range</h3>
          <form onSubmit={applyPrice} className="flex items-center gap-2">
            <input 
              name="min"
              type="number" 
              defaultValue={minPrice}
              placeholder="Min" 
              className="w-full p-2 border border-border rounded-lg text-sm outline-none focus:border-brand"
            />
            <span className="text-muted-foreground">-</span>
            <input 
              name="max"
              type="number" 
              defaultValue={maxPrice}
              placeholder="Max" 
              className="w-full p-2 border border-border rounded-lg text-sm outline-none focus:border-brand"
            />
            <button type="submit" className="p-2 bg-brand text-white rounded-lg font-bold text-sm">
              Go
            </button>
          </form>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h3 className="font-bold mb-4">Categories</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    selectedCategories.includes(category) ? "bg-brand border-brand text-white" : "border-border group-hover:border-brand/50"
                  }`}>
                    {selectedCategories.includes(category) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm">{category}</span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleFilter("categories", category)} 
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <div>
            <h3 className="font-bold mb-4">Brands</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    selectedBrands.includes(brand) ? "bg-brand border-brand text-white" : "border-border group-hover:border-brand/50"
                  }`}>
                    {selectedBrands.includes(brand) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm">{brand}</span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleFilter("brands", brand)} 
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
