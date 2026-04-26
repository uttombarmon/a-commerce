"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function ProductGrid({ products }: { products: any[] }) {
  const addToCart = useCartStore(state => state.addItem);
  const toggleCart = useCartStore(state => state.toggleCart);

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-12 text-center">
        <h3 className="text-xl font-bold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product.id} className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all flex flex-col">
          <Link href={`/product/${product.id}`} className="relative aspect-square bg-muted block overflow-hidden">
            <Image 
              src={product.image || "https://via.placeholder.com/400x400"} 
              alt={product.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </Link>
          
          <div className="p-4 flex flex-col flex-1">
            <div className="text-xs text-muted-foreground mb-1">{product.brand || "Brand"}</div>
            <Link href={`/product/${product.id}`} className="font-bold text-sm line-clamp-2 hover:text-brand transition-colors mb-2">
              {product.title}
            </Link>
            
            <div className="flex items-center gap-1 mb-4 mt-auto">
              <Star className="fill-amber-400 text-amber-400" size={14} />
              <span className="text-sm font-bold">{product.rating?.toFixed(1) || "4.5"}</span>
              <span className="text-xs text-muted-foreground">({product.reviews || 120})</span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                    maxStock: 10
                  });
                  toggleCart(true);
                }}
                className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center hover:bg-brand hover:text-white transition-colors"
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
