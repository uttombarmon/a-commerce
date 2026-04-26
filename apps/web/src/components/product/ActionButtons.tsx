"use client";

import { useState, useCallback } from "react";
import { ShoppingCart, Zap, Heart, GitCompare } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

interface ActionButtonsProps {
  product: Product;
}

export function ActionButtons({ product }: ActionButtonsProps) {
  const { addItem } = useCart();
  const outOfStock = product.outOfStock;
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">("idle");
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (outOfStock) return;
    setCartState("loading");
    // Simulate network call
    await new Promise((r) => setTimeout(r, 800));
    addItem(product);
    setCartState("added");
    setTimeout(() => setCartState("idle"), 2500);
  }, [outOfStock, product, addItem]);

  const handleBuyNow = useCallback(() => {
    if (outOfStock) return;
    // Navigate to checkout (placeholder)
    alert("Proceeding to checkout...");
  }, [outOfStock]);

  return (
    <div className="pdp-actions">
      {/* Add to Cart */}
      <button
        id={`pdp-add-to-cart-${product.id}`}
        onClick={handleAddToCart}
        disabled={outOfStock || cartState === "loading"}
        className={`pdp-actions__cart
          ${cartState === "added" ? "pdp-actions__cart--added" : ""}
          ${cartState === "loading" ? "pdp-actions__cart--loading" : ""}
        `}
        aria-label={
          cartState === "added"
            ? "Added to cart"
            : outOfStock
            ? "Out of stock"
            : "Add to cart"
        }
      >
        {cartState === "loading" ? (
          <span className="pdp-actions__spinner" aria-hidden="true" />
        ) : (
          <ShoppingCart size={18} strokeWidth={2} />
        )}
        <span>
          {cartState === "added"
            ? "✓ Added to Cart"
            : cartState === "loading"
            ? "Adding..."
            : outOfStock
            ? "Out of Stock"
            : "Add to Cart"}
        </span>
      </button>

      {/* Buy Now */}
      <button
        id={`pdp-buy-now-${product.id}`}
        onClick={handleBuyNow}
        disabled={outOfStock}
        className="pdp-actions__buynow"
        aria-label="Buy now"
      >
        <Zap size={18} strokeWidth={2} />
        <span>Buy Now</span>
      </button>

      {/* Wishlist + Compare row */}
      <div className="pdp-actions__secondary">
        <button
          id={`pdp-wishlist-${product.id}`}
          onClick={() => setWishlisted((w) => !w)}
          className={`pdp-actions__wishlist ${wishlisted ? "pdp-actions__wishlist--active" : ""}`}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={17}
            strokeWidth={2}
            className={wishlisted ? "pdp-actions__heart--filled" : ""}
          />
          <span>{wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}</span>
        </button>

        <button className="pdp-actions__compare" aria-label="Add to compare">
          <GitCompare size={16} />
          <span>Compare</span>
        </button>
      </div>
    </div>
  );
}
