import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Bell, Search, ChevronDown } from "lucide-react";
import { CATEGORIES, RESTAURANTS } from "@/data/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, subtotal, restaurant: cartRestaurant } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const filtered = RESTAURANTS.filter((r) => {
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const promoted = RESTAURANTS.filter((r) => r.promoted);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-4 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full" />
          <div className="absolute top-4 -right-4 w-24 h-24 bg-white rounded-full" />
        </div>
        <div className="flex justify-between items-start mb-4 relative">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <MapPin size={14} className="text-primary-foreground opacity-80" />
              <span className="text-primary-foreground opacity-80 text-xs font-medium">Deliver to</span>
              <ChevronDown size={12} className="text-primary-foreground opacity-80" />
            </div>
            <h2 className="text-white font-bold text-lg leading-tight">Home Address</h2>
            <p className="text-white opacity-70 text-xs">123 Main Street, Your City</p>
          </div>
          <button className="bg-white/20 rounded-full p-2 relative">
            <Bell size={20} className="text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F5C518] rounded-full" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants or dishes..."
            className="w-full bg-white rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none shadow-md"
          />
        </div>
      </div>

      <div className="-mt-6 px-4 space-y-5">
        {/* Promo Banner */}
        {!searchQuery && (
          <div className="relative bg-gradient-to-r from-[#F5C518] to-[#FFD94D] rounded-2xl p-4 overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center">
              <span className="text-5xl">🎉</span>
            </div>
            <span className="text-xs font-bold text-[hsl(42_100%_27%)] bg-white/50 px-2 py-0.5 rounded-full">
              Limited time
            </span>
            <p className="font-bold text-[#1A1A1A] text-lg mt-1 leading-tight">Free delivery<br />on your first order!</p>
            <button
              onClick={() => navigate("/restaurant/1")}
              className="mt-2 bg-[#D4006A] text-white text-xs font-bold px-4 py-1.5 rounded-full"
            >
              Order now
            </button>
          </div>
        )}

        {/* Categories */}
        <div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl border transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary border-primary text-primary-foreground shadow-md"
                    : "bg-card border-border text-foreground"
                }`}
              >
                <span className="text-lg leading-none">{cat.emoji}</span>
                <span className="text-[10px] font-semibold whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promoted */}
        {!searchQuery && activeCategory === "all" && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-foreground text-base">⭐ Featured</h2>
              <button className="text-primary text-sm font-semibold">See all</button>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {promoted.map((r) => (
                <div key={r.id} className="flex-shrink-0 w-52" onClick={() => navigate(`/restaurant/${r.id}`)}>
                  <div className={`h-28 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center cursor-pointer`}>
                    <span className="text-5xl">{r.emoji}</span>
                  </div>
                  <p className="font-semibold text-sm mt-1.5 text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.deliveryMinutes} min · {r.deliveryFee === 0 ? "Free delivery" : `$${r.deliveryFee}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Restaurants */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-foreground text-base">
              {searchQuery ? `Results for "${searchQuery}"` : activeCategory === "all" ? "🍽️ All Restaurants" : CATEGORIES.find(c => c.id === activeCategory)?.emoji + " " + CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
            <span className="text-xs text-muted-foreground">{filtered.length} places</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-foreground font-semibold">No results found</p>
              <p className="text-muted-foreground text-sm mt-1">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart floating bar */}
      {totalItems > 0 && (
        <div
          className="fixed bottom-20 left-4 right-4 bg-primary text-primary-foreground rounded-2xl px-4 py-3 flex items-center justify-between shadow-xl cursor-pointer z-30"
          onClick={() => navigate("/cart")}
        >
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white font-bold text-xs w-6 h-6 rounded-lg flex items-center justify-center">
              {totalItems}
            </span>
            <span className="font-semibold text-sm">View cart · {cartRestaurant?.name}</span>
          </div>
          <span className="font-bold text-sm">${subtotal.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
