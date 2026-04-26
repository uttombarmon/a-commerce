import { FormState } from "./types";

export function SeoStatus({ data, onChange }: { data: FormState; onChange: (field: keyof FormState, val: any) => void }) {
  return (
    <div className="form-grid">
      <div className="form-field form-field--full mb-2">
        <h3 className="font-bold text-lg">Product Status</h3>
      </div>
      
      <div className="form-field form-field--full">
        <select 
          className="form-select bg-white max-w-xs font-bold"
          value={data.status}
          onChange={(e) => onChange("status", e.target.value)}
        >
          <option value="draft">Draft - Keep hidden</option>
          <option value="active">Active - Visible to shoppers</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="archived">Archived</option>
        </select>
        <p className="text-xs text-muted-foreground mt-1">Control whether this product is visible to customers.</p>
      </div>

      <div className="form-field form-field--full mt-6 pt-6 border-t border-border">
        <h3 className="font-bold text-lg mb-4">Search Engine Optimization</h3>
      </div>

      <div className="form-field">
        <label className="form-label">URL Slug</label>
        <input 
          type="text" 
          className="form-input" 
          value={data.slug}
          onChange={(e) => onChange("slug", e.target.value)}
          placeholder="e.g., sony-headphones-xm5"
        />
        <p className="text-[10px] text-muted-foreground mt-1">Leave empty to auto-generate from title.</p>
      </div>

      <div className="form-field">
        <label className="form-label">Meta Title</label>
        <input 
          type="text" 
          className="form-input" 
          value={data.metaTitle}
          onChange={(e) => onChange("metaTitle", e.target.value)}
          placeholder="Defaults to Product Title"
          maxLength={60}
        />
        <p className="text-[10px] text-muted-foreground mt-1">{data.metaTitle.length}/60 recommended characters.</p>
      </div>

      <div className="form-field form-field--full">
        <label className="form-label">Meta Description</label>
        <textarea 
          className="form-textarea h-24" 
          value={data.metaDescription}
          onChange={(e) => onChange("metaDescription", e.target.value)}
          placeholder="Brief description for search results..."
          maxLength={160}
        />
        <p className="text-[10px] text-muted-foreground mt-1">{data.metaDescription.length}/160 recommended characters.</p>
      </div>

      <div className="form-field form-field--full border border-border p-6 rounded-2xl bg-white mt-4">
        <label className="form-label mb-2 block">Search Engine Preview</label>
        <div className="mb-1">
          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">Ad</span>
          <span className="text-green-800 text-sm ml-2">
            https://acommerce.com/products/{data.slug || "url-slug"}
          </span>
        </div>
        <p className="text-blue-700 text-lg hover:underline cursor-pointer truncate">
          {data.metaTitle || data.title || "Product Title Preview"} | ACommerce Marketplace
        </p>
        <p className="text-gray-600 text-xs line-clamp-2 mt-1">
          {data.metaDescription || data.description || "Enter a description to see how your product will look in search engine results."}
        </p>
      </div>
    </div>
  );
}
