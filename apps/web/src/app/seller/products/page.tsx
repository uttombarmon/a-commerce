"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Edit, Trash2, Eye, Filter,
  CheckCircle, Clock, Archive, AlertCircle,
  ChevronDown, ArrowUpDown
} from "lucide-react";
import "@/components/seller/seller.css";

interface Product {
  id: number;
  title: string;
  status: "active" | "draft" | "archived" | "out_of_stock";
  category: string;
  stock: number;
  price: number;
  comparePrice?: number;
  sales: number;
  image: string;
  createdAt: string;
}

const STATUS_CONFIG = {
  active:       { label: "Active",       cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={11} /> },
  draft:        { label: "Draft",        cls: "bg-amber-100 text-amber-700",     icon: <Clock size={11} /> },
  archived:     { label: "Archived",     cls: "bg-slate-100 text-slate-500",     icon: <Archive size={11} /> },
  out_of_stock: { label: "Out of Stock", cls: "bg-red-100 text-red-600",         icon: <AlertCircle size={11} /> },
};

const ALL_PRODUCTS: Product[] = [
  { id: 1, title: "Sony WH-1000XM5 Wireless Headphones",     status: "active",       category: "Electronics", stock: 42, price: 349.99, comparePrice: 399.99, sales: 128, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200", createdAt: "2024-01-15" },
  { id: 2, title: "Bose QuietComfort 45 Noise Cancelling",   status: "active",       category: "Electronics", stock: 18, price: 279.99, comparePrice: 329.99, sales: 74,  image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200", createdAt: "2024-02-03" },
  { id: 3, title: "Apple AirPods Pro (2nd Generation)",      status: "out_of_stock", category: "Electronics", stock: 0,  price: 249.00, sales: 211, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200", createdAt: "2024-01-28" },
  { id: 4, title: "Mechanical Gaming Keyboard RGB Backlit",  status: "draft",        category: "Gaming",      stock: 5,  price: 129.99, sales: 0,   image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200", createdAt: "2024-03-10" },
  { id: 5, title: "Jabra Evolve2 85 Professional Headset",   status: "archived",     category: "Electronics", stock: 0,  price: 449.00, sales: 33,  image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200", createdAt: "2023-11-22" },
  { id: 6, title: "Samsung 65\" 4K QLED Smart TV",            status: "active",       category: "TV & Home",   stock: 7,  price: 1199.99, comparePrice: 1499.99, sales: 19, image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=200", createdAt: "2024-02-18" },
  { id: 7, title: "Logitech MX Master 3S Wireless Mouse",    status: "active",       category: "Computing",   stock: 63, price: 99.99,  comparePrice: 119.99, sales: 87,  image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200", createdAt: "2024-01-05" },
  { id: 8, title: "iPad Pro 12.9\" M2 Chip Wi-Fi 256GB",     status: "draft",        category: "Tablets",     stock: 0,  price: 1099.00, sales: 0, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200", createdAt: "2024-03-14" },
];

export default function SellerProductsPage() {
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [sortKey, setSortKey]     = useState<"price" | "stock" | "sales" | "createdAt">("createdAt");
  const [sortDir, setSortDir]     = useState<"asc" | "desc">("desc");
  const [selected, setSelected]   = useState<number[]>([]);

  // --- derived list ---
  const filtered = products
    .filter(p => {
      const matchQ = p.title.toLowerCase().includes(search.toLowerCase()) ||
                     p.category.toLowerCase().includes(search.toLowerCase());
      const matchS = statusFilter === "all" || p.status === statusFilter;
      return matchQ && matchS;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      return (a[sortKey] as number) > (b[sortKey] as number) ? dir : -dir;
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const toggleSelect = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(prev => prev.length === filtered.length ? [] : filtered.map(p => p.id));

  const bulkDelete = () => {
    setProducts(prev => prev.filter(p => !selected.includes(p.id)));
    setSelected([]);
  };

  const SortBtn = ({ col }: { col: typeof sortKey }) => (
    <button onClick={() => toggleSort(col)} className="ml-1 opacity-50 hover:opacity-100">
      <ArrowUpDown size={12} />
    </button>
  );

  return (
    <div className="seller-page">
      {/* Header */}
      <header className="seller-header">
        <div>
          <h1 className="seller-title">Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} total products in your catalog</p>
        </div>
        <Link href="/seller/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </Link>
      </header>

      {/* Toolbar */}
      <div className="seller-toolbar">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="search-bar" style={{ width: 300 }}>
            <Search className="search-bar__icon" size={16} />
            <input
              className="search-bar__input"
              placeholder="Search by title or category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status pills */}
          <div className="flex gap-1.5">
            {["all", "active", "draft", "out_of_stock", "archived"].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                {s === "all" ? "All" : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-200">
            <span className="text-sm font-semibold text-muted-foreground">{selected.length} selected</span>
            <button
              onClick={bulkDelete}
              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
            >
              Delete selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="form-card !p-0 overflow-hidden">
        <table className="seller-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th>Product</th>
              <th>Status</th>
              <th>Category</th>
              <th>Price <SortBtn col="price" /></th>
              <th>Stock <SortBtn col="stock" /></th>
              <th>Sales <SortBtn col="sales" /></th>
              <th>Revenue</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const discount = p.comparePrice
                ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)
                : 0;

              return (
                <tr key={p.id} className="seller-table__row">
                  <td>
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="seller-table__img">
                        <img src={p.image} alt={p.title} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-tight line-clamp-2 max-w-[220px]">{p.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Added {p.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`seller-status-badge ${STATUS_CONFIG[p.status].cls}`}>
                      {STATUS_CONFIG[p.status].icon}
                      {STATUS_CONFIG[p.status].label}
                    </span>
                  </td>
                  <td className="text-sm text-muted-foreground">{p.category}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">${p.price.toFixed(2)}</span>
                      {discount > 0 && (
                        <span className="text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`font-semibold text-sm ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-500" : "text-foreground"}`}>
                      {p.stock === 0 ? "—" : p.stock}
                    </span>
                  </td>
                  <td className="text-sm font-semibold">{p.sales}</td>
                  <td className="text-sm font-bold text-emerald-600">
                    ${(p.price * p.sales).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Link href={`/product/${p.id}`} className="p-2 hover:bg-muted rounded-lg transition-colors" title="View">
                        <Eye size={15} className="text-muted-foreground" />
                      </Link>
                      <Link href={`/seller/products/${p.id}/edit`} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
                        <Edit size={15} className="text-muted-foreground" />
                      </Link>
                      <button
                        onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search size={28} className="text-muted-foreground opacity-40" />
            </div>
            <p className="font-bold text-lg">No products found</p>
            <p className="text-muted-foreground text-sm mt-1">Try a different search or filter.</p>
            <Link href="/seller/products/new" className="btn-primary mt-6 flex items-center gap-2">
              <Plus size={16} /> Add your first product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
