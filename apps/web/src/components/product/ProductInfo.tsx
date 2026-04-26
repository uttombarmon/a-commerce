"use client";

import Link from "next/link";
import { Star, Share2, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";
import type { ProductDetail, StockStatus } from "@/types/product";

interface ProductInfoProps {
  product: ProductDetail;
}

function StockBadge({ status, count }: { status: StockStatus; count: number }) {
  if (status === "in_stock") {
    return (
      <div className="pdp-stock pdp-stock--in">
        <ShieldCheck size={14} />
        <span>In Stock <span className="pdp-stock__count">({count} available)</span></span>
      </div>
    );
  }
  if (status === "low_stock") {
    return (
      <div className="pdp-stock pdp-stock--low">
        <AlertTriangle size={14} />
        <span>Only {count} left — Order soon!</span>
      </div>
    );
  }
  return (
    <div className="pdp-stock pdp-stock--out">
      <XCircle size={14} />
      <span>Out of Stock</span>
    </div>
  );
}

export function ProductInfo({ product }: ProductInfoProps) {
  const fullStars = Math.floor(product.rating);
  const half = product.rating % 1 >= 0.5;

  return (
    <div className="pdp-info">
      {/* Breadcrumb */}
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="pdp-breadcrumb__link">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="#" className="pdp-breadcrumb__link">{product.category}</Link>
        <span aria-hidden="true">/</span>
        <Link href="#" className="pdp-breadcrumb__link">{product.subcategory}</Link>
        <span aria-hidden="true">/</span>
        <span className="pdp-breadcrumb__current" aria-current="page">
          {product.brand}
        </span>
      </nav>

      {/* Brand + SKU row */}
      <div className="pdp-info__meta-row">
        <Link href="#" className="pdp-info__brand">{product.brand}</Link>
        <span className="pdp-info__sku">SKU: {product.sku}</span>
        <button className="pdp-info__share" aria-label="Share product">
          <Share2 size={16} />
        </button>
      </div>

      {/* Title */}
      <h1 className="pdp-info__title">{product.title}</h1>

      {/* Rating row */}
      <div className="pdp-info__rating-row">
        <div className="pdp-stars" aria-label={`${product.rating} out of 5`} role="img">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < fullStars
                  ? "pdp-star--full"
                  : half && i === fullStars
                  ? "pdp-star--half"
                  : "pdp-star--empty"
              }
            />
          ))}
        </div>
        <span className="pdp-info__rating-val">{product.rating}</span>
        <a href="#reviews" className="pdp-info__review-link">
          {product.reviews.toLocaleString()} reviews
        </a>
        <span className="pdp-info__divider" aria-hidden="true">·</span>
        <span className="pdp-info__sold">
          {product.soldCount && product.soldCount >= 1000
            ? `${(product.soldCount / 1000).toFixed(1)}k`
            : product.soldCount}{" "}
          sold
        </span>
      </div>

      {/* Stock */}
      <StockBadge status={product.stockStatus} count={product.stockCount} />
    </div>
  );
}
