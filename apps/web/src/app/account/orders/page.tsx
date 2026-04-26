"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Search } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Delivered</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Shipped</span>;
      default:
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Processing</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Order History</h1>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-24 bg-white rounded-2xl" />
          <div className="h-24 bg-white rounded-2xl" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-border shadow-sm">
          <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
          <h2 className="text-xl font-bold mb-2">No orders found</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
          <Link href="/" className="px-6 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-xl">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-muted-foreground">
                  {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                </p>
                <Link 
                  href={`/account/orders/${order.id}`}
                  className="flex items-center gap-1 text-brand font-bold hover:bg-brand/5 px-4 py-2 rounded-lg transition-colors"
                >
                  View Details
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
