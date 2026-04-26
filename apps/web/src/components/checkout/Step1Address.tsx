"use client";

import { useState, useEffect } from "react";
import { useCheckoutStore, Address } from "@/store/checkoutStore";
import { MapPin, Plus } from "lucide-react";

export function Step1Address() {
  const setAddress = useCheckoutStore(state => state.setAddress);
  const nextStep = useCheckoutStore(state => state.nextStep);
  const selectedAddress = useCheckoutStore(state => state.selectedAddress);
  
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", zip: "", country: "USA"
  });

  useEffect(() => {
    // Fetch mock addresses
    fetch("/api/user/addresses")
      .then(res => res.json())
      .then(data => {
        setSavedAddresses(data.addresses);
        if (data.addresses.length > 0 && !selectedAddress) {
          setAddress(data.addresses[0]);
        }
        setLoading(false);
      });
  }, [selectedAddress, setAddress]);

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/user/addresses", {
      method: "POST",
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      setSavedAddresses([...savedAddresses, data.address]);
      setAddress(data.address);
      setShowNewForm(false);
    }
  };

  if (loading) return <div className="animate-pulse h-40 bg-muted rounded-xl" />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Shipping Address</h2>
        <p className="text-muted-foreground text-sm">Where should we send your order?</p>
      </div>

      {!showNewForm ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAddresses.map((addr) => (
              <div 
                key={addr.id}
                onClick={() => setAddress(addr)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedAddress?.id === addr.id 
                    ? "border-brand bg-brand/5 ring-1 ring-brand" 
                    : "border-border hover:border-brand/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className={`mt-0.5 ${selectedAddress?.id === addr.id ? "text-brand" : "text-muted-foreground"}`} size={20} />
                  <div>
                    <p className="font-bold">{addr.fullName}</p>
                    <p className="text-sm text-muted-foreground">{addr.street}</p>
                    <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                    <p className="text-sm text-muted-foreground mt-1">{addr.phone}</p>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={() => setShowNewForm(true)}
              className="p-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-brand hover:border-brand hover:bg-brand/5 transition-all h-full min-h-[120px]"
            >
              <Plus size={24} className="mb-2" />
              <span className="font-bold text-sm">Add New Address</span>
            </button>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              onClick={nextStep}
              disabled={!selectedAddress}
              className="px-8 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              Continue to Shipping
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveNew} className="space-y-4 border border-border p-6 rounded-xl bg-muted/10">
          {/* Mock Google Maps Autocomplete */}
          <div className="mb-6 pb-6 border-b border-border">
            <label className="block text-sm font-bold mb-2">Search Address (Google Maps Mock)</label>
            <input 
              type="text" 
              placeholder="Start typing your address..." 
              className="w-full p-3 border border-border rounded-lg bg-white"
              onChange={(e) => {
                if (e.target.value.length > 5) {
                  setFormData({
                    ...formData,
                    street: "123 Mockingbird Lane",
                    city: "San Francisco",
                    state: "CA",
                    zip: "94105",
                    country: "USA"
                  });
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Full Name</label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Phone Number</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border border-border rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-1">Street Address</label>
              <input required type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full p-3 border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">City</label>
              <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 border border-border rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-bold mb-1">State</label>
                <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-3 border border-border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">ZIP Code</label>
                <input required type="text" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="w-full p-3 border border-border rounded-lg" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowNewForm(false)} className="px-6 py-3 border border-border rounded-xl font-bold hover:bg-muted">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:opacity-90">Save Address</button>
          </div>
        </form>
      )}
    </div>
  );
}
