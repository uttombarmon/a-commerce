"use client";

import { useEffect, useState } from "react";
import { WishlistItemCard } from "@/components/wishlist/WishlistItemCard";
import { Heart, Lock } from "lucide-react";
import Link from "next/link";

export default function SharedWishlistPage({ params }: { params: { slug: string } }) {
  const [list, setList] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch /api/wishlists/shared/${params.slug}
    // Mocking the fetch for now:
    setTimeout(() => {
      setList({
        name: "My Custom PC Build",
        isPublic: true,
        user: { name: "John Doe" },
        items: [
          {
            productId: 101,
            title: "Mock GPU 4090",
            image: "https://via.placeholder.com/400x400?text=GPU",
            price: 1599.99,
            addedPrice: 1699.99,
            maxStock: 5
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [params.slug]);

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center animate-pulse text-brand font-bold text-xl">Loading list...</div>;
  }

  if (!list || !list.isPublic) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center">
        <Lock size={64} className="mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">This list is private or doesn't exist.</h1>
        <p className="text-muted-foreground mb-8">The owner may have deleted this list or changed its privacy settings.</p>
        <Link href="/" className="px-6 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <Heart className="mx-auto text-rose-500 fill-rose-500 mb-4" size={48} />
        <h1 className="text-4xl font-bold mb-2">{list.name}</h1>
        <p className="text-muted-foreground">Curated by <span className="font-bold text-foreground">{list.user.name}</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.items.map((item: any) => (
           <WishlistItemCard key={`${item.productId}`} item={item} listId="shared" />
        ))}
      </div>
    </div>
  );
}
