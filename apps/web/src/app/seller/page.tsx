"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus, Package, TrendingUp, DollarSign, Eye,
  Edit, Trash2, Search, Filter, MoreHorizontal,
  CheckCircle, Clock, XCircle, Archive, AlertCircle,
  ArrowUpRight, ArrowDownRight, Zap, Users
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

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
    <motion.div 
      className="seller-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ── Header ─────────────────────────────────── */}
      <header className="seller-header">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest rounded-full">Seller Dashboard</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Status</span>
          </div>
          <h1 className="seller-title">Welcome back, Shop Owner</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your store today.</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link href="/seller/products/new" className="px-6 py-3 bg-brand text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:shadow-[0_8px_25px_-5px_rgba(255,107,0,0.4)] transition-all hover:-translate-y-1 active:scale-95">
            <Plus size={20} strokeWidth={3} />
            Add New Product
          </Link>
        </motion.div>
      </header>

      {/* ── Stats ──────────────────────────────────── */}
      <motion.div className="seller-stats-grid" variants={itemVariants}>
        <StatCard 
          icon={<DollarSign />} 
          label="Total Revenue" 
          value={`$${totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} 
          color="#4f46e5" 
          trend="+12.5%" 
          isPositive={true}
        />
        <StatCard 
          icon={<Package />}    
          label="Total Products" 
          value={String(products.length)} 
          color="#0ea5e9" 
          trend="+2" 
          isPositive={true}
        />
        <StatCard 
          icon={<TrendingUp />} 
          label="Total Orders" 
          value={String(totalOrders)} 
          color="#10b981" 
          trend="+18%" 
          isPositive={true}
        />
        <StatCard 
          icon={<Users />} 
          label="Store Visitors" 
          value="2.4k" 
          color="#f59e0b" 
          trend="-3%" 
          isPositive={false}
        />
      </motion.div>

      {/* ── Performance & Health ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div className="lg:col-span-2 form-card !p-6" variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-lg">Sales Performance</h3>
              <p className="text-xs text-muted-foreground">Revenue over the last 7 days</p>
            </div>
            <select className="text-xs font-bold bg-muted border-none rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          
          {/* Mock Chart */}
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
              <motion.div 
                key={i}
                className="w-full bg-brand/10 rounded-t-lg relative group"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${(height * 15).toLocaleString()}
                </div>
                <div className="absolute inset-0 bg-brand opacity-20 group-hover:opacity-40 transition-opacity rounded-t-lg" />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day} className="text-[10px] font-bold text-muted-foreground uppercase">{day}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="form-card !p-6 flex flex-col" variants={itemVariants}>
          <h3 className="font-black text-lg mb-4">Store Health</h3>
          <div className="flex-1 flex flex-col gap-6">
            <HealthMetric label="Fulfillment Rate" value={98} color="text-emerald-500" />
            <HealthMetric label="Customer Satisfaction" value={85} color="text-brand" />
            <HealthMetric label="Response Time" value={92} color="text-amber-500" />
            
            <div className="mt-auto pt-6 border-t border-border/50">
              <div className="p-4 bg-muted/50 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-xs font-black">Pro Tip</p>
                  <p className="text-[11px] text-muted-foreground">Add high-quality videos to your products to increase conversion by 30%.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Toolbar ────────────────────────────────── */}
      <motion.div className="seller-toolbar" variants={itemVariants}>
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
        <div className="flex gap-2 bg-muted p-1 rounded-xl">
          {["all", "active", "draft", "out_of_stock", "archived"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-black capitalize transition-all ${
                statusFilter === s
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "All" : STATUS_BADGE[s]?.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Product Table ───────────────────────────── */}
      <motion.div className="form-card !p-0 overflow-hidden" variants={itemVariants}>
        <table className="seller-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Revenue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} className="seller-table__row group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="seller-table__img ring-2 ring-transparent group-hover:ring-brand/20 transition-all">
                      {product.image && <img src={product.image} alt="" />}
                    </div>
                    <span className="text-sm font-bold line-clamp-1 max-w-[200px]">{product.title}</span>
                  </div>
                </td>
                <td>
                  <span className={`seller-status-badge ${STATUS_BADGE[product.status]?.color}`}>
                    {STATUS_BADGE[product.status]?.icon}
                    {STATUS_BADGE[product.status]?.label}
                  </span>
                </td>
                <td className="font-black text-sm">${product.price.toFixed(2)}</td>
                <td>
                  <div className="flex flex-col gap-1">
                    <span className={`text-sm font-bold ${product.stock === 0 ? "text-red-500" : "text-foreground"}`}>
                      {product.stock}
                    </span>
                    <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-sm font-bold">{product.sales ?? 0}</span>
                </td>
                <td className="font-black text-emerald-600 text-sm">
                  ${(product.price * (product.sales || 0)).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Link href={`/seller/products/${product.id}/edit`} className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground">
                      <Edit size={16} />
                    </Link>
                    <button className="p-2 hover:bg-red-50 rounded-xl transition-all text-muted-foreground hover:text-red-500"
                      onClick={() => setProducts(prev => prev.filter(p => p.id !== product.id))}>
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-muted-foreground opacity-40" />
            </div>
            <p className="font-black text-lg">No products found</p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">Try changing your filters or add a new product to get started.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, color, trend, isPositive }: { icon: React.ReactNode; label: string; value: string; color: string, trend: string, isPositive: boolean }) {
  return (
    <div className="seller-stat-card group hover:border-brand/30 transition-all cursor-default">
      <div className="seller-stat-card__icon" style={{ background: color + "1a", color }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-muted-foreground font-bold">{label}</p>
          <div className={`flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            {isPositive ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
            {trend}
          </div>
        </div>
        <p className="text-3xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function HealthMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
        <span className={`text-xs font-black ${color}`}>{value}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color.replace('text-', 'bg-')}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
