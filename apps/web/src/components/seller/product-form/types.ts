export interface Variant {
  name: string;
  price: number;
  stock: number;
  sku: string;
  barcode?: string;
}

export interface Option {
  type: string;
  values: string[];
}

export interface FormState {
  // Step 1: Basic Info
  title: string;
  description: string;
  brand: string;
  category: string;
  
  // Step 2: Media
  images: string[];
  
  // Step 3: Variants
  options: Option[];
  variants: Variant[];
  
  // Step 4: Pricing
  basePrice: number;
  comparePrice: number;
  costPrice: number;
  bulkPricing: { quantity: number; price: number }[];
  
  // Step 5: Inventory & Shipping
  trackInventory: boolean;
  globalStock: number;
  lowStockThreshold: number;
  globalSku: string;
  globalBarcode: string;
  weight: number;
  dimensions: { l: number; w: number; h: number };
  
  // Step 6: SEO & Status
  slug: string;
  metaTitle: string;
  metaDescription: string;
  status: "draft" | "active" | "archived" | "out_of_stock";
}

export const STEPS = [
  { id: 1, label: "Basic Info", icon: "Package" },
  { id: 2, label: "Media", icon: "ImageIcon" },
  { id: 3, label: "Variants", icon: "Layers" },
  { id: 4, label: "Pricing", icon: "DollarSign" },
  { id: 5, label: "Inventory & Shipping", icon: "Truck" },
  { id: 6, label: "SEO & Status", icon: "Search" },
] as const;
