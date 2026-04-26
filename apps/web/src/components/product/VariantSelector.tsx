"use client";

import { useState } from "react";
import type { ColorVariant, SizeVariant } from "@/types/product";

interface VariantSelectorProps {
  colors: ColorVariant[];
  sizes: SizeVariant[];
  onColorChange?: (color: ColorVariant) => void;
  onSizeChange?: (size: SizeVariant) => void;
  onQuantityChange?: (qty: number) => void;
}

export function VariantSelector({
  colors,
  sizes,
  onColorChange,
  onSizeChange,
  onQuantityChange,
}: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(
    colors.length > 0 ? colors[0] : null
  );
  const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(
    sizes.find((s) => s.available) ?? null
  );
  const [qty, setQty] = useState(1);

  function handleColor(c: ColorVariant) {
    setSelectedColor(c);
    onColorChange?.(c);
  }

  function handleSize(s: SizeVariant) {
    if (!s.available) return;
    setSelectedSize(s);
    onSizeChange?.(s);
  }

  function handleQty(delta: number) {
    setQty((q) => {
      const next = Math.min(99, Math.max(1, q + delta));
      onQuantityChange?.(next);
      return next;
    });
  }

  return (
    <div className="pdp-variants">
      {/* Color */}
      {colors.length > 0 && (
        <div className="pdp-variants__group">
          <div className="pdp-variants__label">
            Colour: <strong>{selectedColor?.label}</strong>
          </div>
          <div className="pdp-variants__swatches" role="radiogroup" aria-label="Select colour">
            {colors.map((c) => (
              <button
                key={c.id}
                role="radio"
                aria-checked={selectedColor?.id === c.id}
                aria-label={c.label}
                title={c.label}
                onClick={() => handleColor(c)}
                className={`pdp-swatch ${selectedColor?.id === c.id ? "pdp-swatch--active" : ""}`}
                style={{ "--swatch-color": c.hex } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {sizes.length > 1 && (
        <div className="pdp-variants__group">
          <div className="pdp-variants__label">
            Size: <strong>{selectedSize?.label}</strong>
          </div>
          <div className="pdp-variants__sizes" role="radiogroup" aria-label="Select size">
            {sizes.map((s) => (
              <button
                key={s.id}
                role="radio"
                aria-checked={selectedSize?.id === s.id}
                aria-disabled={!s.available}
                disabled={!s.available}
                onClick={() => handleSize(s)}
                className={`pdp-size-btn
                  ${selectedSize?.id === s.id ? "pdp-size-btn--active" : ""}
                  ${!s.available ? "pdp-size-btn--unavailable" : ""}
                `}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="pdp-variants__group">
        <div className="pdp-variants__label">Quantity</div>
        <div className="pdp-qty" role="group" aria-label="Quantity selector">
          <button
            onClick={() => handleQty(-1)}
            className="pdp-qty__btn"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
          >
            −
          </button>
          <input
            type="number"
            className="pdp-qty__input"
            value={qty}
            min={1}
            max={99}
            readOnly
            aria-label="Quantity"
          />
          <button
            onClick={() => handleQty(1)}
            className="pdp-qty__btn"
            aria-label="Increase quantity"
            disabled={qty >= 99}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
