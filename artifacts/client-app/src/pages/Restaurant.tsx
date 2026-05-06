import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Star, Clock, Bike, Plus, Minus, ShoppingCart } from "lucide-react";
import { RESTAURANTS } from "@/data/restaurants";
import { useCart } from "@/context/CartContext";

export default function Restaurant() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const restaurant = RESTAURANTS.find((r) => r.id === id);
  const { addItem, increment, decrement, getQuantity, totalItems, subtotal } = useCart();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="font-semibold text-foreground">Restaurant not found</p>
          <button onClick={() => navigate("/")} className="mt-4 text-primary font-semibold text-sm">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const categories = [...new Set(restaurant.menu.map((m) => m.category))];
  const effectiveCategory = activeCategory ?? categories[0];
  const filteredMenu = restaurant.menu.filter((m) => m.category === effectiveCategory);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero */}
      <div className={`h-52 bg-gradient-to-br ${restaurant.gradient} flex items-center justify-center relative`}>
        <span className="text-8xl drop-shadow-lg">{restaurant.emoji}</span>
        <button
          onClick={() => navigate("/")}
          className="absolute top-10 left-4 bg-white/90 backdrop-blur rounded-full p-2 shadow"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-card mx-4 -mt-6 rounded-2xl p-4 shadow-md border border-border">
        <h1 className="font-bold text-xl text-foreground">{restaurant.name}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{restaurant.description}</p>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-[#F5C518] fill-[#F5C518]" />
            <span className="font-semibold text-sm text-foreground">{restaurant.rating}</span>
            <span className="text-xs text-muted-foreground">({restaurant.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={14} />
            <span className="text-sm">{restaurant.deliveryMinutes} min</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Bike size={14} />
            <span className="text-sm">
              {restaurant.deliveryFee === 0 ? "Free delivery" : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
            </span>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {restaurant.tags.map((t) => (
            <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 bg-background/95 backdrop-blur z-10 px-4 py-3 border-b border-border">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
                effectiveCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-4 space-y-3">
        <h3 className="font-bold text-foreground text-base">{effectiveCategory}</h3>
        {filteredMenu.map((item) => {
          const qty = getQuantity(item.id);
          return (
            <div key={item.id} className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <div className="flex justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                    {item.popular && (
                      <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{item.description}</p>
                  <p className="font-bold text-primary mt-2 text-base">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                    <span className="text-3xl">
                      {restaurant.emoji}
                    </span>
                  </div>
                  {qty === 0 ? (
                    <button
                      onClick={() => addItem(item, restaurant)}
                      className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                    >
                      <Plus size={16} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-2 py-1">
                      <button onClick={() => decrement(item.id)}>
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{qty}</span>
                      <button onClick={() => addItem(item, restaurant)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart floating bar */}
      {totalItems > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between shadow-xl cursor-pointer z-30 safe-area-pb"
          onClick={() => navigate("/cart")}
        >
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-lg w-8 h-8 flex items-center justify-center">
              <ShoppingCart size={16} className="text-white" />
            </div>
            <span className="font-semibold text-sm">{totalItems} items</span>
          </div>
          <span className="font-bold">View Cart · ${subtotal.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
