"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import "./cart.css";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="cart-page flex flex-col items-center justify-center text-center py-20">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our top categories and find something you love!
        </p>
        <Link href="/" className="checkout-btn !w-auto px-8 flex items-center gap-2">
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page">
      <h1 className="text-4xl font-black mb-10 tracking-tight">Shopping Cart</h1>
      
      <div className="cart-layout">
        {/* Items List */}
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="cart-item__info">
                <div>
                  <Link href={`/product/${item.id}`} className="cart-item__title">
                    {item.title}
                  </Link>
                  <p className="cart-item__seller">Sold by {item.sellerName || "ACommerce"}</p>
                </div>
                <div className="cart-item__actions">
                  <div className="quantity-stepper">
                    <button 
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button 
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="cart-item__price">${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      className="cart-item__remove"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>
          
          <div className="cart-summary__row">
            <span>Subtotal ({itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="cart-summary__row">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn">
            Proceed to Checkout
          </button>

          <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-dashed border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              * Shipping costs and taxes are calculated based on your location and will be finalized during checkout.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
