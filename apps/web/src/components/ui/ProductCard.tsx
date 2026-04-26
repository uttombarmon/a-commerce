"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Truck,
  ShieldCheck,
} from "lucide-react";
import type { ProductCardProps } from "@/types/product";
import { useCart } from "@/context/CartContext";

// ─── Helper: Star Rating ──────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="product-card__rating" aria-label={`${rating} out of 5 stars, ${count.toLocaleString()} reviews`}>
      <div className="product-card__stars" role="img">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} className="product-card__star product-card__star--full" size={12} />
        ))}
        {half && (
          <span className="product-card__star-half" aria-hidden="true">
            <Star className="product-card__star product-card__star--full" size={12} />
            <Star className="product-card__star product-card__star--empty product-card__star-half-empty" size={12} />
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} className="product-card__star product-card__star--empty" size={12} />
        ))}
      </div>
      <span className="product-card__rating-count">
        {rating.toFixed(1)} <span aria-hidden="true">({count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count})</span>
      </span>
    </div>
  );
}

// ─── Helper: Discount Badge ───────────────────────────────────────────────────

function DiscountBadge({ original, current }: { original: number; current: number }) {
  const pct = Math.round(((original - current) / original) * 100);
  if (pct <= 0) return null;
  return (
    <div className="product-card__badge product-card__badge--discount" aria-label={`${pct}% off`}>
      -{pct}%
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductCard({
  id,
  title,
  price,
  comparePrice,
  image,
  rating,
  reviews,
  sellerName,
  soldCount,
  freeShipping = true,
  outOfStock = false,
  className = "",
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (outOfStock) return;
      setCartAdded(true);
      addItem({ id, title, price, comparePrice, image, rating, reviews, sellerName, soldCount, freeShipping, outOfStock });
      onAddToCart?.(id);
      setTimeout(() => setCartAdded(false), 1800);
    },
    [id, title, price, comparePrice, image, rating, reviews, sellerName, soldCount, freeShipping, outOfStock, addItem, onAddToCart]
  );

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setWishlisted((prev) => !prev);
    },
    []
  );

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onQuickView?.(id);
    },
    [id, onQuickView]
  );

  return (
    <article
      className={`product-card ${outOfStock ? "product-card--oos" : ""} ${className}`}
      aria-label={title}
    >
      {/* ── IMAGE ZONE ─────────────────────────────────────────────────── */}
      <Link href={`/product/${id}`} className="product-card__image-wrap" tabIndex={0} aria-label={`View ${title}`}>
        {/* Skeleton shimmer while loading */}
        {!imgLoaded && <div className="product-card__skeleton" aria-hidden="true" />}

        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 400px) 100vw, (max-width: 768px) 50vw, 25vw"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`product-card__img ${imgLoaded ? "product-card__img--loaded" : ""}`}
        />

        {/* Discount badge – top-left */}
        {comparePrice && comparePrice > price && (
          <DiscountBadge original={comparePrice} current={price} />
        )}

        {/* Shipping badge – top-right */}
        {freeShipping && !outOfStock && (
          <div className="product-card__badge product-card__badge--shipping" aria-label="Free delivery">
            <Truck size={10} strokeWidth={2.5} />
            Free
          </div>
        )}

        {/* Wishlist toggle – absolute */}
        <button
          id={`wishlist-${id}`}
          onClick={handleWishlist}
          className={`product-card__wishlist ${wishlisted ? "product-card__wishlist--active" : ""}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          <Heart
            size={16}
            strokeWidth={2}
            className={wishlisted ? "product-card__heart--filled" : ""}
          />
        </button>

        {/* Quick view – appears on hover */}
        <button
          id={`quickview-${id}`}
          onClick={handleQuickView}
          className="product-card__quickview"
          aria-label="Quick view"
        >
          <Eye size={14} strokeWidth={2} />
          <span>Quick View</span>
        </button>

        {/* Out-of-stock overlay */}
        {outOfStock && (
          <div className="product-card__oos-overlay" aria-live="polite">
            <ShieldCheck size={22} className="mb-1 opacity-70" />
            <span>Out of Stock</span>
          </div>
        )}

        {/* Image overlay on hover (gradient) */}
        <div className="product-card__img-overlay" aria-hidden="true" />
      </Link>

      {/* ── CONTENT ZONE ───────────────────────────────────────────────── */}
      <div className="product-card__body">
        {/* Seller row */}
        {(sellerName || soldCount) && (
          <div className="product-card__meta">
            {sellerName && (
              <span className="product-card__seller" title={sellerName}>
                {sellerName}
              </span>
            )}
            {soldCount && (
              <span className="product-card__sold">
                {soldCount >= 1000
                  ? `${(soldCount / 1000).toFixed(soldCount >= 10000 ? 0 : 1)}k`
                  : soldCount}{" "}
                sold
              </span>
            )}
          </div>
        )}

        {/* Title – 2-line clamp with ellipsis */}
        <Link href={`/product/${id}`} className="product-card__title-link">
          <h3 className="product-card__title" title={title}>
            {title}
          </h3>
        </Link>

        {/* Star rating */}
        <StarRating rating={rating} count={reviews} />

        {/* Price row */}
        <div className="product-card__price-row">
          <span className="product-card__price">${price.toFixed(2)}</span>
          {comparePrice && comparePrice > price && (
            <span className="product-card__compare-price">
              ${comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart – slides up on hover */}
        <button
          id={`addtocart-${id}`}
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`product-card__cart-btn ${cartAdded ? "product-card__cart-btn--added" : ""}`}
          aria-label={outOfStock ? "Out of stock" : "Add to cart"}
        >
          <ShoppingCart size={15} strokeWidth={2} />
          <span>{cartAdded ? "Added!" : outOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </button>
      </div>
    </article>
  );
}
