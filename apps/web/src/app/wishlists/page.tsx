"use client";

import { useState, useEffect } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { WishlistItemCard } from "@/components/wishlist/WishlistItemCard";
import { Share2, Plus, Heart, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { lists, activeListId, setActiveList, createList } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const activeList = lists.find(l => l.id === activeListId) || lists[0];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList(newListName.trim(), false);
      setNewListName("");
      setIsCreating(false);
    }
  };

  const handleShare = () => {
    if (!activeList.isPublic) {
      alert("This list is private. We will automatically make it public to share.");
      // In a real app, call /api/wishlists/share
    }
    const url = `${window.location.origin}/wishlists/shared/${activeList.slug}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="text-rose-500 fill-rose-500" />
            Your Wishlists
          </h1>
          <p className="text-muted-foreground mt-2">Manage your saved items and custom lists.</p>
        </div>

        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Create New List
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveList(list.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                activeList.id === list.id 
                  ? "bg-brand text-white font-bold shadow-md" 
                  : "bg-white hover:bg-muted border border-border text-foreground"
              }`}
            >
              <span className="truncate">{list.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeList.id === list.id ? "bg-white/20" : "bg-muted-foreground/20"}`}>
                {list.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white border border-border rounded-2xl p-6 min-h-[500px]">
          {isCreating ? (
            <motion.form 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleCreateList} 
              className="mb-8 p-6 bg-muted/30 rounded-xl border border-border"
            >
              <h3 className="font-bold mb-4">Create a New List</h3>
              <div className="flex gap-4">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Birthday Gifts, PC Build..." 
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  className="flex-1 p-3 border border-border rounded-xl"
                />
                <button type="submit" className="px-6 bg-brand text-white font-bold rounded-xl">Save</button>
                <button type="button" onClick={() => setIsCreating(false)} className="px-6 border border-border rounded-xl font-bold">Cancel</button>
              </div>
            </motion.form>
          ) : null}

          <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold">{activeList.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                {activeList.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                {activeList.isPublic ? "Public List" : "Private List"}
              </div>
            </div>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl font-bold hover:bg-muted transition-colors"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          {activeList.items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
              <Heart size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-bold text-foreground">This list is empty</p>
              <p>Explore our catalog and click the heart icon to save items here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeList.items.map(item => (
                <WishlistItemCard key={`${item.productId}-${item.variantId}`} item={item} listId={activeList.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
