import { FormState } from "./types";

export function InventoryShipping({ data, onChange }: { data: FormState; onChange: (field: keyof FormState, val: any) => void }) {
  const hasVariants = data.variants.length > 0;

  return (
    <div className="form-grid">
      <div className="form-field form-field--full mb-2">
        <h3 className="font-bold text-lg">Inventory</h3>
      </div>
      
      {!hasVariants ? (
        <>
          <div className="form-field form-field--full flex flex-row items-center gap-3">
            <input 
              type="checkbox" 
              className="w-4 h-4" 
              checked={data.trackInventory}
              onChange={(e) => onChange("trackInventory", e.target.checked)}
            />
            <label className="text-sm font-bold">Track quantity</label>
          </div>
          
          <div className="form-field">
            <label className="form-label">Available Stock</label>
            <input 
              type="number" 
              className="form-input" 
              value={data.globalStock}
              onChange={(e) => onChange("globalStock", parseInt(e.target.value) || 0)}
              disabled={!data.trackInventory}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Low Stock Threshold</label>
            <input 
              type="number" 
              className="form-input" 
              value={data.lowStockThreshold}
              onChange={(e) => onChange("lowStockThreshold", parseInt(e.target.value) || 0)}
              disabled={!data.trackInventory}
            />
          </div>
          <div className="form-field">
            <label className="form-label">SKU (Stock Keeping Unit)</label>
            <input 
              type="text" 
              className="form-input" 
              value={data.globalSku}
              onChange={(e) => onChange("globalSku", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Barcode (UPC, EAN, ISBN)</label>
            <input 
              type="text" 
              className="form-input" 
              value={data.globalBarcode}
              onChange={(e) => onChange("globalBarcode", e.target.value)}
            />
          </div>
        </>
      ) : (
        <div className="form-field form-field--full">
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200">
            <p className="font-bold text-sm">Inventory is managed at the variant level.</p>
            <p className="text-xs mt-1">Please go to the Variants step to set stock, SKU, and barcodes for individual variants.</p>
          </div>
        </div>
      )}

      <div className="form-field form-field--full mt-6 pt-6 border-t border-border">
        <h3 className="font-bold text-lg mb-4">Shipping</h3>
      </div>
      
      <div className="form-field">
        <label className="form-label">Weight (kg)</label>
        <input 
          type="number" 
          className="form-input" 
          value={data.weight}
          onChange={(e) => onChange("weight", parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="form-field flex gap-2">
        <div className="flex-1">
          <label className="form-label">Length</label>
          <input 
            type="number" 
            className="form-input" 
            value={data.dimensions.l}
            onChange={(e) => onChange("dimensions", { ...data.dimensions, l: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="flex-1">
          <label className="form-label">Width</label>
          <input 
            type="number" 
            className="form-input" 
            value={data.dimensions.w}
            onChange={(e) => onChange("dimensions", { ...data.dimensions, w: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="flex-1">
          <label className="form-label">Height</label>
          <input 
            type="number" 
            className="form-input" 
            value={data.dimensions.h}
            onChange={(e) => onChange("dimensions", { ...data.dimensions, h: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}
