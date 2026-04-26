"use client";

import Image from "next/image";
import { Trash2, ShoppingCart, TrendingDown } from "lucide-react";
import { useWishlistStore, WishlistItem } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";

interface WishlistItemCardProps {
  item: WishlistItem;
  listId: string;
}

export function WishlistItemCard({ item, listId }: WishlistItemCardProps) {
  const removeItem = useWishlistStore(state => state.removeItem);
  const addToCart = useCartStore(state => state.addItem);
  const toggleCart = useCartStore(state => state.toggleCart);

  // Mock checking current price vs addedPrice for price drop UI
  const currentPrice = item.price; // In a real app, this would be fetched live
  const hasPriceDrop = currentPrice < item.addedPrice;

  const handleAddToCart = () => {
    addToCart({
      productId: item.productId,
      variantId: item.variantId,
      quantity: 1,
      title: item.title,
      image: item.image,
      price: currentPrice,
      maxStock: item.maxStock
    });
    toggleCart(true);
  };

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      <div className="relative aspect-square bg-muted">
        <Image src={item.image} alt={item.title} fill className="object-cover" />
        
        {/* Remove Button Overlay */}
        <button 
          onClick={() => removeItem(listId, item.productId, item.variantId)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur text-muted-foreground hover:text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
          title="Remove from list"
        >
          <Trash2 size={18} />
        </button>

        {hasPriceDrop && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <TrendingDown size={14} /> Price Drop
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-sm line-clamp-2 mb-1">{item.title}</h3>
        
        <div className="flex items-end gap-2 mb-4 mt-auto">
          <span className="font-bold text-lg text-brand">${currentPrice.toFixed(2)}</span>
          {hasPriceDrop && (
            <span className="text-xs text-muted-foreground line-through mb-1">
              ${item.addedPrice.toFixed(2)}
            </span>
          )}
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={item.maxStock <= 0}
          className="w-full py-2.5 flex items-center justify-center gap-2 border-2 border-brand text-brand font-bold rounded-xl hover:bg-brand hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand"
        >
          <ShoppingCart size={18} />
          {item.maxStock <= 0 ? "Out of Stock" : "Move to Cart"}
        </button>
      </div>
    </div>
  );
}
