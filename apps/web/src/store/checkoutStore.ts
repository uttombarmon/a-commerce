import { create } from 'zustand';

export interface Address {
  id?: number;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CheckoutState {
  currentStep: number;
  selectedAddress: Address | null;
  shippingMethod: 'standard' | 'express' | 'same_day' | null;
  deliveryDate: Date | null;
  paymentMethod: 'credit_card' | 'bkash' | 'nagad' | 'cod' | 'sslcommerz' | null;
  paymentDetails: any; // E.g., saved card token
  shippingFee: number;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAddress: (address: Address) => void;
  setShipping: (method: 'standard' | 'express' | 'same_day', fee: number, date: Date | null) => void;
  setPayment: (method: 'credit_card' | 'bkash' | 'nagad' | 'cod' | 'sslcommerz', details?: any) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  currentStep: 1,
  selectedAddress: null,
  shippingMethod: null,
  deliveryDate: null,
  paymentMethod: null,
  paymentDetails: null,
  shippingFee: 0,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  setAddress: (address) => set({ selectedAddress: address }),
  
  setShipping: (method, fee, date) => set({ 
    shippingMethod: method, 
    shippingFee: fee, 
    deliveryDate: date 
  }),
  
  setPayment: (method, details) => set({ 
    paymentMethod: method, 
    paymentDetails: details 
  }),
  
  resetCheckout: () => set({
    currentStep: 1,
    selectedAddress: null,
    shippingMethod: null,
    deliveryDate: null,
    paymentMethod: null,
    paymentDetails: null,
    shippingFee: 0,
  }),
}));
