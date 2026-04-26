"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface AddToCartButtonProps {
  productId: number;
  productTitle: string;
  image: string;
  price: number;
  maxStock: number;
  variantId?: number;
  variantName?: string;
  className?: string;
}

export function AddToCartButton({ 
  productId, 
  productTitle, 
  image, 
  price, 
  maxStock, 
  variantId, 
  variantName, 
  className = "" 
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const handleAdd = () => {
    if (maxStock <= 0) return;

    addItem({
      productId,
      variantId,
      quantity: 1,
      title: productTitle,
      image,
      price,
      variantName,
      maxStock
    });

    setAdded(true);
    // Automatically open drawer
    toggleCart(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={maxStock <= 0 || added}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
        added 
          ? "bg-emerald-500 text-white" 
          : maxStock <= 0 
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-brand text-white hover:opacity-90 active:scale-95"
      } ${className}`}
    >
      {added ? (
        <>
          <Check size={20} className="animate-in zoom-in" />
          <span>Added</span>
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          <span>{maxStock <= 0 ? "Out of Stock" : "Add to Cart"}</span>
        </>
      )}
    </button>
  );
}
