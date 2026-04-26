import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: number;
  variantId?: number;
  addedPrice: number;
  
  // Denormalized UI data
  title: string;
  image: string;
  price: number;
  maxStock: number;
}

export interface Wishlist {
  id: string; // temp local ID or DB ID
  name: string;
  slug: string;
  isDefault: boolean;
  isPublic: boolean;
  items: WishlistItem[];
}

export interface WishlistState {
  lists: Wishlist[];
  activeListId: string | null;
  
  // Actions
  createList: (name: string, isPublic?: boolean) => void;
  setActiveList: (id: string) => void;
  addItem: (listId: string, item: WishlistItem) => void;
  removeItem: (listId: string, productId: number, variantId?: number) => void;
  toggleItem: (listId: string, item: WishlistItem) => void;
  isInList: (listId: string, productId: number, variantId?: number) => boolean;
  
  // Sync
  syncWithDatabase: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      lists: [
        {
          id: 'default',
          name: 'My Wishlist',
          slug: 'default',
          isDefault: true,
          isPublic: false,
          items: []
        }
      ],
      activeListId: 'default',

      createList: (name, isPublic = false) => set((state) => {
        const newList = {
          id: crypto.randomUUID(),
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          isDefault: false,
          isPublic,
          items: []
        };
        return { lists: [...state.lists, newList], activeListId: newList.id };
      }),

      setActiveList: (id) => set({ activeListId: id }),

      addItem: (listId, item) => set((state) => ({
        lists: state.lists.map(list => {
          if (list.id === listId) {
            // Check if exists
            const exists = list.items.some(i => i.productId === item.productId && i.variantId === item.variantId);
            if (exists) return list;
            return { ...list, items: [...list.items, item] };
          }
          return list;
        })
      })),

      removeItem: (listId, productId, variantId) => set((state) => ({
        lists: state.lists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              items: list.items.filter(i => !(i.productId === productId && i.variantId === variantId))
            };
          }
          return list;
        })
      })),

      toggleItem: (listId, item) => {
        const state = get();
        const exists = state.isInList(listId, item.productId, item.variantId);
        if (exists) {
          state.removeItem(listId, item.productId, item.variantId);
        } else {
          state.addItem(listId, item);
        }
      },

      isInList: (listId, productId, variantId) => {
        const list = get().lists.find(l => l.id === listId);
        if (!list) return false;
        return list.items.some(i => i.productId === productId && i.variantId === variantId);
      },

      syncWithDatabase: async () => {
        const state = get();
        console.log("[Wishlist Store] Syncing local wishlists to database...");
        
        try {
          // Send all lists and their items to the backend to merge
          const response = await fetch('/api/wishlists/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lists: state.lists })
          });
          
          if (response.ok) {
            const data = await response.json();
            // In a real app, update state with DB IDs
            console.log("[Wishlist Store] Sync successful");
          }
        } catch (error) {
          console.error("[Wishlist Store] Sync failed", error);
        }
      }
    }),
    {
      name: 'ecommerce-wishlists',
      partialize: (state) => ({ lists: state.lists, activeListId: state.activeListId }),
    }
  )
);
