// ─── Product Domain Types ─────────────────────────────────────────────────────

export interface Product {
  id: string | number;
  title: string;
  price: number;
  /** Original/crossed-out price before discount */
  comparePrice?: number;
  image: string;
  rating: number;
  reviews: number;
  /** Seller or brand name */
  sellerName?: string;
  /** Number of units sold */
  soldCount?: number;
  /** Show free-shipping badge */
  freeShipping?: boolean;
  /** Mark as out of stock */
  outOfStock?: boolean;
  /** soldPercentage for flash sales */
  soldPercentage?: number;
}

export interface ProductCardProps extends Product {
  /** Override for className on the root element */
  className?: string;
  /** Called when "Add to cart" is clicked */
  onAddToCart?: (id: string | number) => void;
  /** Called when the Quick View button is clicked */
  onQuickView?: (id: string | number) => void;
}
