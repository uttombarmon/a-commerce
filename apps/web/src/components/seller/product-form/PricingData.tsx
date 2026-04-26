import { FormState } from "./types";
import { Plus, Trash2 } from "lucide-react";

export function PricingData({ data, onChange }: { data: FormState; onChange: (field: keyof FormState, val: any) => void }) {
  const addBulkTier = () => {
    onChange("bulkPricing", [...data.bulkPricing, { quantity: 10, price: data.basePrice * 0.9 }]);
  };

  const updateBulkTier = (index: number, field: "quantity" | "price", val: number) => {
    const newTiers = [...data.bulkPricing];
    newTiers[index] = { ...newTiers[index], [field]: val };
    onChange("bulkPricing", newTiers);
  };

  const removeBulkTier = (index: number) => {
    onChange("bulkPricing", data.bulkPricing.filter((_, i) => i !== index));
  };

  return (
    <div className="form-grid">
      <div className="form-field">
        <label className="form-label">Base Price ($)</label>
        <input 
          type="number" 
          className="form-input" 
          value={data.basePrice}
          onChange={(e) => onChange("basePrice", parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Compare-at Price ($)</label>
        <input 
          type="number" 
          className="form-input" 
          value={data.comparePrice}
          onChange={(e) => onChange("comparePrice", parseFloat(e.target.value) || 0)}
        />
        <p className="text-xs text-muted-foreground mt-1">To show a reduced price, move the original price here.</p>
      </div>
      <div className="form-field">
        <label className="form-label">Cost per item ($)</label>
        <input 
          type="number" 
          className="form-input" 
          value={data.costPrice}
          onChange={(e) => onChange("costPrice", parseFloat(e.target.value) || 0)}
        />
        <p className="text-[10px] text-muted-foreground mt-1">Customers won't see this. Used for profit calculation.</p>
      </div>
      <div className="form-field flex flex-row items-center gap-3 bg-muted/30 p-4 rounded-xl">
        <input type="checkbox" className="w-4 h-4" defaultChecked />
        <div>
          <p className="text-sm font-bold">Charge tax on this product</p>
          <p className="text-xs text-muted-foreground">Standard 8% sales tax will be applied.</p>
        </div>
      </div>

      <div className="form-field form-field--full mt-6 pt-6 border-t border-border">
        <div className="flex justify-between items-center mb-4">
          <label className="form-label">Bulk Pricing Tiers</label>
          <button type="button" className="text-brand text-sm font-bold flex items-center gap-1 hover:underline" onClick={addBulkTier}>
            <Plus size={14} /> Add Tier
          </button>
        </div>
        
        {data.bulkPricing.length > 0 ? (
          <div className="flex flex-col gap-3">
            {data.bulkPricing.map((tier, i) => (
              <div key={i} className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground block mb-1">Min Quantity</label>
                  <input 
                    type="number" 
                    className="form-input !py-1" 
                    value={tier.quantity} 
                    onChange={(e) => updateBulkTier(i, "quantity", parseInt(e.target.value) || 0)} 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground block mb-1">Price per item ($)</label>
                  <input 
                    type="number" 
                    className="form-input !py-1" 
                    value={tier.price} 
                    onChange={(e) => updateBulkTier(i, "price", parseFloat(e.target.value) || 0)} 
                  />
                </div>
                <button type="button" className="mt-5 text-red-400 hover:text-red-600" onClick={() => removeBulkTier(i)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground bg-muted p-4 rounded-xl text-center">
            No bulk pricing tiers added. Add tiers to incentivize larger purchases.
          </p>
        )}
      </div>
    </div>
  );
}
