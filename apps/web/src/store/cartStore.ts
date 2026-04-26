import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // unique ID for the cart row (temp UUID for local, or DB ID)
  productId: number;
  variantId?: number;
  quantity: number;
  
  // Denormalized data for UI
  title: string;
  image: string;
  price: number;
  variantName?: string;
  maxStock: number;
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  discountAmount: number;
  
  // Actions
  toggleCart: (open?: boolean) => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  removeCoupon: () => void;
  clearCart: () => void;
  moveToWishlist: (id: string) => Promise<void>;
  
  // Sync
  syncWithDatabase: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountAmount: 0,

      toggleCart: (open?: boolean) => set((state) => ({ 
        isOpen: open !== undefined ? open : !state.isOpen 
      })),

      addItem: (newItem) => set((state) => {
        // Check if item already exists (same product and variant)
        const existingIndex = state.items.findIndex(
          i => i.productId === newItem.productId && i.variantId === newItem.variantId
        );

        if (existingIndex >= 0) {
          const updatedItems = [...state.items];
          const newQty = updatedItems[existingIndex].quantity + newItem.quantity;
          
          // Stock validation
          if (newQty > newItem.maxStock) {
            updatedItems[existingIndex].quantity = newItem.maxStock;
          } else {
            updatedItems[existingIndex].quantity = newQty;
          }
          
          return { items: updatedItems };
        }

        return { 
          items: [...state.items, { ...newItem, id: crypto.randomUUID() }] 
        };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => {
        return {
          items: state.items.map(i => {
            if (i.id === id) {
              const safeQty = Math.max(1, Math.min(quantity, i.maxStock));
              return { ...i, quantity: safeQty };
            }
            return i;
          })
        };
      }),

      applyCoupon: async (code) => {
        // In a real app, this would hit /api/cart/coupon
        // Mocking for now:
        if (code.toLowerCase() === 'save20') {
          set({ couponCode: code, discountAmount: 20 });
          return { success: true };
        }
        return { success: false, message: 'Invalid or expired coupon' };
      },

      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

      moveToWishlist: async (id) => {
        const item = get().items.find(i => i.id === id);
        if (!item) return;
        
        // Mock API call to save to wishlist
        console.log(`[Cart Store] Moved product ${item.productId} to wishlist`);
        
        set((state) => ({
          items: state.items.filter(i => i.id !== id)
        }));
      },

      syncWithDatabase: async () => {
        const state = get();
        if (state.items.length === 0) return;

        console.log("[Cart Store] Syncing local cart to database...");
        
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: state.items })
          });
          
          if (response.ok) {
            console.log("[Cart Store] Sync successful");
            // Optionally, fetch fresh DB items and update state
          }
        } catch (error) {
          console.error("[Cart Store] Sync failed", error);
        }
      }
    }),
    {
      name: 'ecommerce-cart',
      // Only persist these fields to localStorage
      partialize: (state) => ({ 
        items: state.items, 
        couponCode: state.couponCode, 
        discountAmount: state.discountAmount 
      }),
    }
  )
);
