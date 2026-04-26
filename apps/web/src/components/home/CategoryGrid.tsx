"use client";

import { Monitor, Smartphone, BookOpen, Shirt, Home, Car, Utensils, Music } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { id: 1, name: "Electronics", icon: Monitor },
  { id: 2, name: "Mobiles", icon: Smartphone },
  { id: 3, name: "Books", icon: BookOpen },
  { id: 4, name: "Fashion", icon: Shirt },
  { id: 5, name: "Home & Kitchen", icon: Home },
  { id: 6, name: "Automotive", icon: Car },
  { id: 7, name: "Grocery", icon: Utensils },
  { id: 8, name: "Music", icon: Music },
];

export function CategoryGrid() {
  return (
    <section className="py-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Browse Categories</h2>
        <button className="text-sm font-medium text-brand hover:text-brand-hover transition-colors">View All</button>
      </div>
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4">
        {categories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="shrink-0"
            >
              <Link 
                href={`/category/${category.id}`}
                className="flex items-center space-x-2 bg-surface hover:bg-muted border border-border px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all group"
              >
                <Icon size={18} className="text-muted-foreground group-hover:text-brand transition-colors" />
                <span className="text-sm font-semibold text-primary">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
