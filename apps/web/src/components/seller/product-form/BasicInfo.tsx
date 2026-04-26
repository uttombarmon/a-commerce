import { FormState } from "./types";

export function BasicInfo({ data, onChange }: { data: FormState; onChange: (field: keyof FormState, val: any) => void }) {
  return (
    <div className="form-grid">
      <div className="form-field form-field--full">
        <label className="form-label">Product Title</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div className="form-field form-field--full">
        <label className="form-label">Description</label>
        <div className="border border-border rounded-xl overflow-hidden bg-surface">
          <div className="bg-muted p-2 flex gap-2 border-b border-border">
            <button type="button" className="p-1 hover:bg-border rounded text-sm font-bold w-8">B</button>
            <button type="button" className="p-1 hover:bg-border rounded text-sm italic w-8">I</button>
            <button type="button" className="p-1 hover:bg-border rounded text-sm underline w-8">U</button>
          </div>
          <textarea 
            className="form-textarea w-full h-40 border-none rounded-none focus:ring-0 resize-none" 
            placeholder="Tell shoppers about your product..."
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>
      </div>
      <div className="form-field">
        <label className="form-label">Brand</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="e.g. Sony"
          value={data.brand}
          onChange={(e) => onChange("brand", e.target.value)}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Category</label>
        <select 
          className="form-select"
          value={data.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="electronics/audio">Electronics &gt; Audio</option>
          <option value="electronics/audio/headphones">Electronics &gt; Audio &gt; Headphones</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home & Kitchen</option>
        </select>
        <p className="text-xs text-muted-foreground mt-1">Select the most specific category.</p>
      </div>
    </div>
  );
}
