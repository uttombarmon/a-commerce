"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { useCartStore, type CartItem } from "@/store/cartStore";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const moveToWishlist = useCartStore(state => state.moveToWishlist);

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
        <Image src={item.image} alt={item.title} fill className="object-cover" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-sm truncate">{item.title}</h4>
          {item.variantName && (
            <p className="text-xs text-muted-foreground">{item.variantName}</p>
          )}
          <div className="text-brand font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</div>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Stepper */}
          <div className="flex items-center border border-border rounded-lg">
            <button 
              className="p-1 hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
            <button 
              className="p-1 hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => moveToWishlist(item.id)}
              className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
              title="Save for later"
            >
              <Heart size={16} />
            </button>
            <button 
              onClick={() => removeItem(item.id)}
              className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Remove"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        {item.quantity >= item.maxStock && (
          <p className="text-[10px] text-amber-600 mt-1">Max stock reached</p>
        )}
      </div>
    </div>
  );
}
