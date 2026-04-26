import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";

interface ProductCardProps {
  id: string | number;
  title: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating: number;
  reviews: number;
  prime?: boolean;
}

export function ProductCard({ id, title, price, comparePrice, image, rating, reviews }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col transition-all duration-300">
      {/* Image Container */}
      <Link href={`/product/${id}`} className="relative aspect-square w-full overflow-hidden rounded-3xl bg-muted/50 mb-4 transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-black/5 dark:group-hover:shadow-white/5">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover p-6 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        {/* Discount Badge */}
        {comparePrice && comparePrice > price && (
          <div className="absolute top-4 left-4 bg-white dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Save Math.round(((comparePrice - price) / comparePrice) * 100)%
          </div>
        )}
      </Link>
      
      {/* Content */}
      <div className="flex flex-col px-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-primary truncate pr-4">
            {title}
          </h3>
          <div className="flex items-center space-x-1 shrink-0 bg-muted px-2 py-0.5 rounded-full">
            <Star size={12} className="fill-foreground text-foreground" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
            {comparePrice && comparePrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                ${comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Add to Cart Button */}
      <button className="absolute bottom-16 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:scale-105 active:scale-95">
        <Plus size={20} />
      </button>
    </div>
  );
}
