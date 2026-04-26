// ─── Base Product (used by ProductCard) ───────────────────────────────────────

export interface Product {
  id: string | number;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  /** Original/crossed-out price before discount */
  comparePrice?: number;
  image: string;
  /** Simple image URLs (used by cards/search). ProductDetail overrides this with ProductImage[] */
  images?: string[];
  rating: number;
  reviews: number;
  /** Seller or brand name */
  sellerName?: string;
  /** Number of units sold */
  soldCount?: number;
  brand?: string;
  category?: string;
  location?: string;
  /** Show free-shipping badge */
  freeShipping?: boolean;
  /** Mark as out of stock */
  outOfStock?: boolean;
  /** soldPercentage for flash sales */
  soldPercentage?: number;
}

export interface SearchParams {
  q?: string;
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  shipping?: string;
  sort?: string;
  page?: number;
  view?: "grid" | "list";
}

export interface ProductCardProps extends Product {
  className?: string;
  onAddToCart?: (id: string | number) => void;
  onQuickView?: (id: string | number) => void;
}

// ─── Product Detail (full PDP data) ──────────────────────────────────────────

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  /** Used as thumbnail */
  thumb: string;
}

export interface ColorVariant {
  id: string;
  label: string;
  /** Hex color value */
  hex: string;
  /** Optional image to switch to when this color is selected */
  imageIndex?: number;
}

export interface SizeVariant {
  id: string;
  label: string;
  available: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  /** Positive feedback % */
  positiveRate: number;
  /** Response rate % */
  responseRate: number;
  /** avg response time label e.g. "within 2 hours" */
  responseTime: string;
  verified: boolean;
  joinedYear: number;
}

export interface ProductReview {
  id: string;
  authorName: string;
  /** reviewer's avatar url, or null for initials fallback */
  avatarUrl?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  images?: string[];
}

export interface RatingBreakdown {
  stars: 5 | 4 | 3 | 2 | 1;
  count: number;
  pct: number;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  askedBy: string;
  answeredBy: string;
  date: string;
}

export interface ProductDetail extends Omit<Product, 'images'> {
  brand: string;
  sku: string;
  slug: string;
  category: string;
  subcategory: string;
  stockStatus: StockStatus;
  stockCount: number;
  images: ProductImage[];
  colors: ColorVariant[];
  sizes: SizeVariant[];
  description: string;
  features: string[];
  specs: ProductSpec[];
  seller: Seller;
  ratingBreakdown: RatingBreakdown[];
  reviewList: ProductReview[];
  totalReviews: number;
  qa: QAItem[];
  /** Minimum order value for free shipping */
  freeShippingThreshold: number;
  /** Estimated delivery label */
  estimatedDelivery: string;
  /** Return window in days */
  returnDays: number;
  /** Monthly EMI amount */
  emiMonthly?: number;
}
