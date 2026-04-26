"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Percent, 
  RefreshCw, 
  ArrowUpRight,
  Package,
  Star,
  MoreVertical
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { motion } from "framer-motion";

// ── Mock Data ─────────────────────────────────────────────────────────────

const REVENUE_DATA = [
  { name: "01 Apr", revenue: 45000, previous: 38000 },
  { name: "05 Apr", revenue: 52000, previous: 41000 },
  { name: "10 Apr", revenue: 48000, previous: 45000 },
  { name: "15 Apr", revenue: 61000, previous: 50000 },
  { name: "20 Apr", revenue: 55000, previous: 52000 },
  { name: "25 Apr", revenue: 67000, previous: 55000 },
  { name: "30 Apr", revenue: 72000, previous: 58000 },
];

const ORDER_STATUS_DATA = [
  { name: "Delivered", value: 450, color: "#10b981" },
  { name: "Processing", value: 120, color: "#3b82f6" },
  { name: "Shipped", value: 80, color: "#8b5cf6" },
  { name: "Pending", value: 45, color: "#f59e0b" },
];

const CATEGORY_DATA = [
  { name: "Electronics", value: 400, color: "#6366f1" },
  { name: "Fashion", value: 300, color: "#ec4899" },
  { name: "Home", value: 200, color: "#f59e0b" },
  { name: "Beauty", value: 100, color: "#10b981" },
];

const TOP_PRODUCTS = [
  { name: "iPhone 15 Pro", revenue: 125000, sales: 120 },
  { name: "Sony WH-1000XM5", revenue: 85000, sales: 240 },
  { name: "MacBook Air M3", revenue: 95000, sales: 85 },
  { name: "Nike Air Max", revenue: 45000, sales: 310 },
];

const RECENT_ORDERS = [
  { id: "#ORD-9921", customer: "Liam Johnson", status: "Delivered", amount: "$240.00", date: "2 mins ago" },
  { id: "#ORD-9920", customer: "Emma Wilson", status: "Processing", amount: "$1,250.00", date: "15 mins ago" },
  { id: "#ORD-9919", customer: "Noah Davis", status: "Shipped", amount: "$45.99", date: "1 hour ago" },
  { id: "#ORD-9918", customer: "Olivia Brown", status: "Pending", amount: "$89.00", date: "3 hours ago" },
];

// ── Components ─────────────────────────────────────────────────────────────

const MetricCard = ({ title, value, change, isPositive, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {change}
      </div>
    </div>
    <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">{title}</p>
    <h3 className="text-2xl font-black text-gray-900">{value}</h3>
  </div>
);

export default function AdminDashboard() {
  const [realtimeValue, setRealtimeValue] = useState(72000);

  // Simulate Real-time Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeValue(prev => prev + Math.floor(Math.random() * 100));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Store Overview</h1>
          <p className="text-gray-500 font-medium italic">Showing data for last 30 days compared to previous period.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button className="px-6 py-2.5 bg-brand text-white font-black rounded-xl shadow-lg shadow-brand/20 transition-all">Today</button>
          <button className="px-6 py-2.5 text-gray-500 font-black rounded-xl hover:bg-gray-50 transition-all">This Month</button>
          <button className="px-6 py-2.5 text-gray-500 font-black rounded-xl hover:bg-gray-50 transition-all">All Time</button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
        <MetricCard title="Total GMV" value={`$${realtimeValue.toLocaleString()}`} change="+12.5%" isPositive={true} icon={DollarSign} color="bg-brand" />
        <MetricCard title="Total Orders" value="12,482" change="+8.2%" isPositive={true} icon={ShoppingBag} color="bg-blue-500" />
        <MetricCard title="New Users" value="842" change="-2.4%" isPositive={false} icon={Users} color="bg-emerald-500" />
        <MetricCard title="Avg. Order Value" value="$84.20" change="+1.5%" isPositive={true} icon={TrendingUp} color="bg-indigo-500" />
        <MetricCard title="Conversion" value="3.42%" change="+0.8%" isPositive={true} icon={Percent} color="bg-rose-500" />
        <MetricCard title="Pending Refunds" value="12" change="+4" isPositive={false} icon={RefreshCw} color="bg-amber-500" />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black">Revenue Performance</h2>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-brand rounded-full"></span> This Period</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-200 rounded-full"></span> Previous</div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '800' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ff6b00" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="previous" stroke="#e2e8f0" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black mb-8">Order Status</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ORDER_STATUS_DATA}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {ORDER_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-[-180px] mb-[120px] pointer-events-none">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Total Orders</p>
            <p className="text-3xl font-black">695</p>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black mb-8">Top Products</h2>
          <div className="space-y-6">
            {TOP_PRODUCTS.map((product, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-black text-brand italic">#{i+1}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{product.sales} sales this week</p>
                </div>
                <p className="font-black text-gray-900">${(product.revenue/1000).toFixed(1)}k</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
            View All Products <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black mb-8">Sales by Category</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black">Geographic Activity</h2>
            <Globe className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            {[
              { country: "United States", orders: "4,201", pct: 65, flag: "🇺🇸" },
              { country: "United Kingdom", orders: "1,120", pct: 15, flag: "🇬🇧" },
              { country: "Germany", orders: "840", pct: 12, flag: "🇩🇪" },
              { country: "Canada", orders: "420", pct: 8, flag: "🇨🇦" },
            ].map((item) => (
              <div key={item.country} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>{item.flag} {item.country}</span>
                  <span className="text-gray-400">{item.orders} orders</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black">Recent Orders</h2>
            <button className="text-brand font-bold text-sm hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-50">
                  <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-400">Order ID</th>
                  <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-sm">{order.id}</td>
                    <td className="py-4 font-bold text-sm">{order.customer}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 font-black text-sm text-right text-gray-900">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black">Alerts & Moderation</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="text-xs font-black text-rose-500 uppercase tracking-widest">3 New Alerts</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center">
                <Package size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Low Stock Alert</p>
                <p className="text-xs text-rose-600 font-medium">Logitech MX Master 3S (Only 2 left)</p>
              </div>
              <button className="px-4 py-2 bg-white text-rose-600 text-xs font-black rounded-lg border border-rose-200 hover:bg-rose-500 hover:text-white transition-all">Restock</button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center">
                <Star size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Review Moderation</p>
                <p className="text-xs text-amber-600 font-medium">New 1-star review on "Gaming Monitor"</p>
              </div>
              <button className="px-4 py-2 bg-white text-amber-600 text-xs font-black rounded-lg border border-amber-200 hover:bg-amber-500 hover:text-white transition-all">Moderate</button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Seller Verification</p>
                <p className="text-xs text-blue-600 font-medium">"TechVault Store" submitted docs</p>
              </div>
              <button className="px-4 py-2 bg-white text-blue-600 text-xs font-black rounded-lg border border-blue-200 hover:bg-blue-500 hover:text-white transition-all">Verify</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
