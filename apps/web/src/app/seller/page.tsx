"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Package, TrendingUp, DollarSign, Eye,
  Edit, Trash2, Search, Filter, MoreHorizontal,
  CheckCircle, Clock, XCircle, Archive, AlertCircle
} from "lucide-react";
import "@/components/seller/seller.css";

interface SellerProduct {
  id: number;
  title: string;
  status: "active" | "draft" | "archived" | "out_of_stock";
  stock: number;
  price: number;
  sales?: number;
  image?: string;
}

const STATUS_BADGE: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active:       { label: "Active",       color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={12} /> },
  draft:        { label: "Draft",        color: "bg-amber-100 text-amber-700",   icon: <Clock size={12} /> },
  archived:     { label: "Archived",     color: "bg-slate-100 text-slate-500",   icon: <Archive size={12} /> },
  out_of_stock: { label: "Out of Stock", color: "bg-red-100 text-red-600",       icon: <AlertCircle size={12} /> },
};

const MOCK_PRODUCTS: SellerProduct[] = [
  { id: 1, title: "Sony WH-1000XM5 Wireless Headphones",       status: "active",       stock: 42, price: 349.99, sales: 128, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
  { id: 2, title: "Bose QuietComfort 45 Noise Cancelling",     status: "active",       stock: 18, price: 279.99, sales: 74,  image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200" },
  { id: 3, title: "Apple AirPods Pro (2nd Generation)",        status: "out_of_stock", stock: 0,  price: 249.00, sales: 211, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200" },
  { id: 4, title: "Mechanical Gaming Keyboard RGB",            status: "draft",        stock: 5,  price: 129.99, sales: 0,   image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200" },
  { id: 5, title: "Jabra Evolve2 85 Professional Headset",     status: "archived",     stock: 0,  price: 449.00, sales: 33,  image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200" },
];

export default function SellerDashboard() {
  const [products, setProducts] = useState<SellerProduct[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = products.reduce((acc, p) => acc + p.price * (p.sales || 0), 0);
  const totalOrders  = products.reduce((acc, p) => acc + (p.sales || 0), 0);
  const activeCount  = products.filter(p => p.status === "active").length;

  return (
    <div className="seller-page">
      {/* ── Header ─────────────────────────────────── */}
      <header className="seller-header">
        <div>
          <h1 className="seller-title">Seller Central</h1>
          <p className="text-muted-foreground mt-1">Manage your products, orders, and analytics.</p>
        </div>
        <Link href="/seller/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add Product
        </Link>
      </header>

      {/* ── Stats ──────────────────────────────────── */}
      <div className="seller-stats-grid">
        <StatCard icon={<DollarSign />} label="Total Revenue" value={`$${totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} color="#4f46e5" />
        <StatCard icon={<Package />}    label="Total Products" value={String(products.length)} color="#0ea5e9" />
        <StatCard icon={<TrendingUp />} label="Total Orders" value={String(totalOrders)} color="#10b981" />
        <StatCard icon={<CheckCircle />} label="Active Listings" value={String(activeCount)} color="#f59e0b" />
      </div>

      {/* ── Toolbar ────────────────────────────────── */}
      <div className="seller-toolbar">
        <div className="search-bar" style={{ maxWidth: 360 }}>
          <Search className="search-bar__icon" size={16} />
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "draft", "out_of_stock", "archived"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                statusFilter === s
                  ? "bg-brand text-white"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {s === "all" ? "All" : STATUS_BADGE[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Table ───────────────────────────── */}
      <div className="form-card !p-0 overflow-hidden">
        <table className="seller-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Revenue</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} className="seller-table__row">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="seller-table__img">
                      {product.image && <img src={product.image} alt="" />}
                    </div>
                    <span className="text-sm font-semibold line-clamp-2 max-w-xs">{product.title}</span>
                  </div>
                </td>
                <td>
                  <span className={`seller-status-badge ${STATUS_BADGE[product.status]?.color}`}>
                    {STATUS_BADGE[product.status]?.icon}
                    {STATUS_BADGE[product.status]?.label}
                  </span>
                </td>
                <td className="font-bold">${product.price.toFixed(2)}</td>
                <td>
                  <span className={product.stock === 0 ? "text-red-500 font-bold" : "font-semibold"}>
                    {product.stock}
                  </span>
                </td>
                <td>{product.sales ?? 0}</td>
                <td className="font-bold text-emerald-600">
                  ${(product.price * (product.sales || 0)).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link href={`/seller/products/${product.id}/edit`} className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Edit size={16} className="text-muted-foreground" />
                    </Link>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => setProducts(prev => prev.filter(p => p.id !== product.id))}>
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Package size={40} className="mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="font-bold text-lg">No products found</p>
            <p className="text-muted-foreground text-sm">Try changing your filters or add a new product.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="seller-stat-card">
      <div className="seller-stat-card__icon" style={{ background: color + "1a", color }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
