import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { FormState, Option } from "./types";

export function VariantMatrix({ 
  data, 
  onChange,
  onGenerate 
}: { 
  data: FormState; 
  onChange: (field: keyof FormState, val: any) => void;
  onGenerate: (options: Option[]) => void;
}) {
  const [optionType, setOptionType] = useState("");
  const [optionValues, setOptionValues] = useState("");

  const addOption = () => {
    if (!optionType || !optionValues) return;
    const values = optionValues.split(",").map(v => v.trim()).filter(Boolean);
    if (values.length === 0) return;

    const newOptions = [...data.options, { type: optionType, values }];
    onChange("options", newOptions);
    onGenerate(newOptions);
    setOptionType("");
    setOptionValues("");
  };

  const removeOption = (index: number) => {
    const newOptions = data.options.filter((_, i) => i !== index);
    onChange("options", newOptions);
    onGenerate(newOptions);
  };

  const updateVariant = (index: number, field: string, val: string | number) => {
    const newVariants = [...data.variants];
    newVariants[index] = { ...newVariants[index], [field]: val };
    onChange("variants", newVariants);
  };

  const removeVariant = (index: number) => {
    onChange("variants", data.variants.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="bg-muted/50 p-6 rounded-2xl border border-dashed border-border mb-8">
        <h4 className="text-sm font-bold mb-4">Add Product Options</h4>
        <div className="flex gap-4">
          <input 
            className="form-input !bg-surface flex-1" 
            placeholder="Option Type (e.g., Color, Size, Material)" 
            value={optionType}
            onChange={(e) => setOptionType(e.target.value)}
          />
          <input 
            className="form-input !bg-surface flex-[2]" 
            placeholder="Values (comma separated: Red, Blue, Green)" 
            value={optionValues}
            onChange={(e) => setOptionValues(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addOption()}
          />
          <button type="button" className="btn-primary !py-2" onClick={addOption}>Add</button>
        </div>
      </div>

      {data.options.length > 0 && (
        <div className="mb-8 flex gap-4 flex-wrap">
          {data.options.map((opt, i) => (
            <div key={i} className="chip">
              <span className="opacity-50 mr-1">{opt.type}:</span> {opt.values.join(", ")}
              <X size={12} className="ml-2 cursor-pointer" onClick={() => removeOption(i)} />
            </div>
          ))}
        </div>
      )}

      {data.variants.length > 0 && (
        <div className="overflow-x-auto">
          <table className="variant-matrix-table">
            <thead>
              <tr>
                <th>Variant</th>
                <th>Price ($)</th>
                <th>Stock</th>
                <th>SKU</th>
                <th>Barcode</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.variants.map((v, i) => (
                <tr key={i}>
                  <td className="font-bold text-sm">{v.name}</td>
                  <td>
                    <input 
                      type="number" 
                      className="form-input !py-1 w-24" 
                      value={v.price} 
                      onChange={(e) => updateVariant(i, "price", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      className="form-input !py-1 w-20" 
                      value={v.stock} 
                      onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="form-input !py-1 w-32" 
                      value={v.sku} 
                      onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="form-input !py-1 w-32" 
                      placeholder="UPC/EAN"
                      value={v.barcode || ""} 
                      onChange={(e) => updateVariant(i, "barcode", e.target.value)}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => removeVariant(i)}>
                      <Trash2 size={16} className="text-red-400 cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
