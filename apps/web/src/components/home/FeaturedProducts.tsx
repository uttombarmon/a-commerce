import { ProductCard } from "../ui/ProductCard";
import type { Product } from "@/types/product";

// ─── Mock data ────────────────────────────────────────────────────────────────

const featuredProducts: Product[] = [
  {
    id: 201,
    title: "Echo Dot (5th Gen) Smart Speaker with Alexa — Charcoal",
    price: 49.99,
    comparePrice: 69.99,
    rating: 4.7,
    reviews: 25043,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=400&auto=format&fit=crop",
    sellerName: "Amazon Devices",
    soldCount: 15000,
    freeShipping: true,
  },
  {
    id: 202,
    title: "Kindle Paperwhite (8 GB) – 6.8\" display & adjustable warm light",
    price: 139.99,
    comparePrice: 179.99,
    rating: 4.8,
    reviews: 18412,
    image: "https://images.unsplash.com/photo-1592496001020-d3124286f52e?q=80&w=400&auto=format&fit=crop",
    sellerName: "Amazon Devices",
    soldCount: 9800,
    freeShipping: true,
  },
  {
    id: 203,
    title: "Fire TV Stick 4K Max Streaming Device – Wi-Fi 6E, Alexa",
    price: 54.99,
    comparePrice: 79.99,
    rating: 4.6,
    reviews: 32891,
    image: "https://images.unsplash.com/photo-1540224871915-bc8ffb782bdf?q=80&w=400&auto=format&fit=crop",
    sellerName: "Amazon Devices",
    soldCount: 22000,
    freeShipping: true,
  },
  {
    id: 204,
    title: "Blink Outdoor (3rd Gen) Wireless Weather-Resistant HD Camera",
    price: 99.99,
    comparePrice: 149.99,
    rating: 4.4,
    reviews: 12036,
    image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?q=80&w=400&auto=format&fit=crop",
    sellerName: "Blink by Amazon",
    soldCount: 6200,
    freeShipping: true,
    outOfStock: false,
  },
  {
    id: 205,
    title: "Ring Video Doorbell — 1080p HD video, motion detection",
    price: 99.99,
    comparePrice: 129.99,
    rating: 4.7,
    reviews: 85214,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400&auto=format&fit=crop",
    sellerName: "Ring",
    soldCount: 41000,
    freeShipping: true,
  },
  {
    id: 206,
    title: "Fire HD 10 Tablet, 10.1\" 1080p Full HD, 32 GB — Denim",
    price: 149.99,
    comparePrice: 199.99,
    rating: 4.5,
    reviews: 21433,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop",
    sellerName: "Amazon Devices",
    soldCount: 11500,
    freeShipping: true,
    outOfStock: true,
  },
  {
    id: 207,
    title: "eero Pro 6E Tri-band Mesh Wi-Fi 6E Router — fast home WiFi",
    price: 299.99,
    comparePrice: 399.99,
    rating: 4.6,
    reviews: 5401,
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=400&auto=format&fit=crop",
    sellerName: "eero by Amazon",
    soldCount: 3100,
    freeShipping: true,
  },
  {
    id: 208,
    title: "Luna Wireless Controller — works with PC, Mac, Fire TV",
    price: 69.99,
    comparePrice: 89.99,
    rating: 4.3,
    reviews: 8912,
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=400&auto=format&fit=crop",
    sellerName: "Amazon Games",
    soldCount: 4500,
    freeShipping: false,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Featured Products</h2>
          <p className="text-muted-foreground mt-2">Handpicked for your exceptional taste.</p>
        </div>
        <button className="text-brand hover:text-brand-hover font-semibold text-sm hidden sm:block transition-colors">
          View Collection →
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

// ─── New Arrivals ─────────────────────────────────────────────────────────────

const newArrivals: Product[] = [
  {
    id: 301,
    title: "Minimalist Mechanical Keyboard — Hot-swap, RGB, TKL",
    price: 129.99,
    comparePrice: 159.99,
    rating: 5.0,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=400&auto=format&fit=crop",
    sellerName: "KeyLab",
    soldCount: 200,
    freeShipping: true,
  },
  {
    id: 302,
    title: "Ergonomic Mesh Office Chair — Lumbar support, adjustable",
    price: 349.50,
    comparePrice: 499.00,
    rating: 4.5,
    reviews: 8,
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400&auto=format&fit=crop",
    sellerName: "ErgoHome",
    soldCount: 80,
    freeShipping: true,
  },
  {
    id: 303,
    title: "Smart Home Hub Gen 2 — Thread, Zigbee, Matter compatible",
    price: 89.99,
    comparePrice: 119.99,
    rating: 4.0,
    reviews: 5,
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=400&auto=format&fit=crop",
    sellerName: "SmartNest",
    soldCount: 50,
    freeShipping: false,
  },
  {
    id: 304,
    title: "Wireless Charging Pad Duo — MagSafe-compatible, 15W",
    price: 45.00,
    comparePrice: 59.99,
    rating: 4.8,
    reviews: 22,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=400&auto=format&fit=crop",
    sellerName: "ChargeTech",
    soldCount: 320,
    freeShipping: true,
  },
];

export function NewArrivals() {
  return (
    <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto w-full bg-muted/30 rounded-[3rem] my-12 border border-border/50 backdrop-blur-xl">
      <div className="flex justify-between items-end mb-10 px-4 md:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">New Arrivals</h2>
          <p className="text-muted-foreground mt-2">The latest tech, just dropped.</p>
        </div>
        <button className="text-brand hover:text-brand-hover font-semibold text-sm hidden sm:block transition-colors">
          Shop all new →
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
