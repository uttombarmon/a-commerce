import { ProductCard } from "../ui/ProductCard";

const featuredProducts = [
  { id: 201, title: 'Echo Dot (5th Gen) | Smart speaker with Alexa', price: 49.99, rating: 4.7, reviews: 25000, image: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=400&auto=format&fit=crop" },
  { id: 202, title: 'Kindle Paperwhite (8 GB) – Now with a 6.8" display', price: 139.99, rating: 4.8, reviews: 18400, image: "https://images.unsplash.com/photo-1592496001020-d3124286f52e?q=80&w=400&auto=format&fit=crop" },
  { id: 203, title: 'Fire TV Stick 4K Max streaming device', price: 54.99, rating: 4.6, reviews: 32000, image: "https://images.unsplash.com/photo-1540224871915-bc8ffb782bdf?q=80&w=400&auto=format&fit=crop" },
  { id: 204, title: 'Blink Outdoor (3rd Gen) - wireless, weather-resistant', price: 99.99, rating: 4.4, reviews: 12000, image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?q=80&w=400&auto=format&fit=crop" },
  { id: 205, title: 'Ring Video Doorbell - 1080p HD video', price: 99.99, rating: 4.7, reviews: 85000, image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400&auto=format&fit=crop" },
  { id: 206, title: 'Fire HD 10 tablet, 10.1", 1080p Full HD', price: 149.99, rating: 4.5, reviews: 21000, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop" },
  { id: 207, title: 'Eero Pro 6E mesh Wi-Fi router', price: 299.99, rating: 4.6, reviews: 5400, image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=400&auto=format&fit=crop" },
  { id: 208, title: "Luna Wireless Controller", price: 69.99, rating: 4.3, reviews: 8900, image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=400&auto=format&fit=crop" },
];

export function FeaturedProducts() {
  return (
    <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Featured Products</h2>
          <p className="text-muted-foreground mt-2">Handpicked for your exceptional taste.</p>
        </div>
        <button className="text-brand hover:text-brand-hover font-semibold text-sm hidden sm:block">View Collection</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

const newArrivals = [
  { id: 301, title: "Minimalist Mechanical Keyboard", price: 129.99, rating: 5.0, reviews: 12, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=400&auto=format&fit=crop" },
  { id: 302, title: "Ergonomic Office Chair Premium", price: 349.50, rating: 4.5, reviews: 8, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400&auto=format&fit=crop" },
  { id: 303, title: "Smart Home Hub Gen 2", price: 89.99, rating: 4.0, reviews: 5, image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=400&auto=format&fit=crop" },
  { id: 304, title: "Wireless Charging Pad Duo", price: 45.00, rating: 4.8, reviews: 22, image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=400&auto=format&fit=crop" },
];

export function NewArrivals() {
  return (
    <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto w-full bg-muted/30 rounded-[3rem] my-12 border border-border/50 backdrop-blur-xl">
      <div className="flex justify-between items-end mb-10 px-4 md:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">New Arrivals</h2>
          <p className="text-muted-foreground mt-2">The latest tech, just dropped.</p>
        </div>
        <button className="text-brand hover:text-brand-hover font-semibold text-sm hidden sm:block">Shop all new</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 px-4 md:px-8">
        {newArrivals.map(product => (
          <ProductCard key={product.id} {...product} prime={false} />
        ))}
      </div>
    </section>
  );
}
