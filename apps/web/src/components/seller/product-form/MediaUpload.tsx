import { Plus, X } from "lucide-react";
import { FormState } from "./types";

export function MediaUpload({ data, onChange }: { data: FormState; onChange: (field: keyof FormState, val: any) => void }) {
  const mockUpload = () => {
    if (data.images.length >= 8) {
      alert("Maximum 8 images allowed.");
      return;
    }
    const urls = [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"
    ];
    onChange("images", [...data.images, urls[Math.floor(Math.random() * urls.length)]]);
  };

  const removeImage = (index: number) => {
    onChange("images", data.images.filter((_, i) => i !== index));
  };

  const setMainImage = (index: number) => {
    if (index === 0) return;
    const newImages = [...data.images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    onChange("images", newImages);
  };

  return (
    <div>
      <div className="upload-zone" onClick={mockUpload}>
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
          <Plus className="text-brand" />
        </div>
        <div className="text-center">
          <p className="font-bold">Click or drag files to upload images</p>
          <p className="text-xs text-muted-foreground mt-1">
            Drag and drop up to 8 images (JPG, PNG, WEBP). {data.images.length}/8 uploaded.
          </p>
        </div>
      </div>

      <div className="image-preview-grid">
        {data.images.map((url, i) => (
          <div key={i} className="image-preview group cursor-pointer" onClick={() => setMainImage(i)}>
            <img src={url} alt={`Preview ${i}`} />
            <button 
              type="button"
              className="image-preview__remove opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(i);
              }}
            >
              <X size={12} />
            </button>
            {i === 0 ? (
              <div className="absolute bottom-2 left-2 bg-brand text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                Main Image
              </div>
            ) : (
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Set Main
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
