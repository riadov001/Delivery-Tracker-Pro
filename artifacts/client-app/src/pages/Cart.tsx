import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Minus, Trash2, MapPin, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Step = "cart" | "checkout" | "success";

export default function Cart() {
  const [, navigate] = useLocation();
  const { items, restaurant, subtotal, totalItems, increment, decrement, removeItem, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [address, setAddress] = useState("123 Main Street, Your City");
  const [notes, setNotes] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const total = subtotal + deliveryFee;

  const placeOrder = async () => {
    setIsPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const id = Math.random().toString(36).slice(2, 10).toUpperCase();
    setOrderId(id);
    clear();
    setStep("success");
    setIsPlacing(false);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pb-24">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="text-muted-foreground text-sm mb-1">Your order #{orderId} has been confirmed.</p>
          <p className="text-muted-foreground text-sm">Estimated delivery: 25–35 min</p>
          <div className="mt-8 space-y-3 w-full max-w-xs mx-auto">
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm"
            >
              Track my order
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-muted text-foreground py-3 rounded-xl font-bold text-sm"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pb-24">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm mb-6">Add items from a restaurant to get started</p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm"
          >
            Browse restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1 as never)} className="bg-muted p-2 rounded-full">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <h1 className="font-bold text-foreground text-lg">
            {step === "cart" ? "Your Cart" : "Checkout"}
          </h1>
          {restaurant && <p className="text-muted-foreground text-xs">{restaurant.name}</p>}
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {step === "cart" ? (
          <>
            {/* Cart Items */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {items.map((cartItem, idx) => (
                <div key={cartItem.item.id}>
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{cartItem.item.name}</p>
                      <p className="text-primary font-bold text-sm mt-0.5">
                        ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrement(cartItem.item.id)}
                        className="bg-muted text-foreground rounded-full w-7 h-7 flex items-center justify-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => increment(cartItem.item.id)}
                        className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(cartItem.item.id)}
                        className="ml-1 text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {idx < items.length - 1 && <div className="h-px bg-border mx-4" />}
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-primary" />
                <span className="font-semibold text-sm text-foreground">Delivery Address</span>
              </div>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-sm text-foreground bg-muted rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Notes */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Special Instructions</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests? (optional)"
                rows={2}
                className="w-full text-sm text-foreground bg-muted rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Summary */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery fee</span>
                <span className={deliveryFee === 0 ? "text-[hsl(73_100%_30%)] font-semibold" : ""}>
                  {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <h2 className="font-bold text-foreground">Order Summary</h2>
            {items.map((c) => (
              <div key={c.item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{c.item.name} ×{c.quantity}</span>
                <span className="font-semibold">${(c.item.price * c.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="h-px bg-border" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <div className="bg-muted rounded-xl px-3 py-2">
              <p className="text-xs text-muted-foreground">📍 Delivering to:</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-4 safe-area-pb">
        {step === "cart" ? (
          <button
            onClick={() => setStep("checkout")}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-base"
          >
            Proceed to checkout · ${total.toFixed(2)}
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={placeOrder}
              disabled={isPlacing}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-base disabled:opacity-60"
            >
              {isPlacing ? "Placing order..." : "Place Order · $" + total.toFixed(2)}
            </button>
            <button
              onClick={() => setStep("cart")}
              className="w-full text-muted-foreground text-sm font-medium"
            >
              Back to cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
