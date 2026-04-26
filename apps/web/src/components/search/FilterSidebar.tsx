"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function FilterGroup({ title, children, defaultExpanded = true }: FilterGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="filter-group">
      <button 
        className="filter-group__title"
        onClick={() => setExpanded(!expanded)}
      >
        {title}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {expanded && <div className="filter-group__content">{children}</div>}
    </div>
  );
}

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key);
    
    if (current === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const isSelected = (key: string, value: string) => searchParams.get(key) === value;

  return (
    <aside className="plp-sidebar">
      {/* Category Tree */}
      <FilterGroup title="Department">
        <ul className="filter-list">
          <li 
            className={`filter-item ${isSelected("category", "electronics") ? "font-bold text-pdp-accent" : ""}`}
            onClick={() => updateParam("category", "electronics")}
          >
            Electronics
          </li>
          <li className="filter-item pl-4">Headphones</li>
        </ul>
      </FilterGroup>

      {/* Rating */}
      <FilterGroup title="Customer Reviews">
        <div className="filter-list">
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="filter-item" onClick={() => updateParam("rating", stars.toString())}>
              <input type="checkbox" checked={isSelected("rating", stars.toString())} readOnly />
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill={i < stars ? "currentColor" : "none"} />
                ))}
              </div>
              <span>& Up</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Brand */}
      <FilterGroup title="Brand">
        <div className="filter-list">
          {["Sony", "Bose", "Sennheiser", "Apple", "Jabra"].map((brand) => (
            <label key={brand} className="filter-item" onClick={() => updateParam("brand", brand.toLowerCase())}>
              <input type="checkbox" checked={isSelected("brand", brand.toLowerCase())} readOnly />
              <span>{brand}</span>
              <span className="filter-item__count">({Math.floor(Math.random() * 100)})</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price">
        <div className="price-inputs">
          <input type="number" placeholder="Min" className="price-input" />
          <span className="text-muted-foreground text-xs">to</span>
          <input type="number" placeholder="Max" className="price-input" />
          <button className="page-btn !w-auto !h-auto py-2 px-3">Go</button>
        </div>
      </FilterGroup>

      {/* Shipping */}
      <FilterGroup title="Shipping & Offers">
        <div className="filter-list">
          <label className="filter-item">
            <input type="checkbox" />
            <span>Free Delivery</span>
          </label>
          <label className="filter-item">
            <input type="checkbox" />
            <span>Discounted</span>
          </label>
        </div>
      </FilterGroup>
    </aside>
  );
}
