import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { RESTAURANTS } from "@/data/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";

export default function Search() {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          r.menu.some((m) => m.name.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-10 pb-4">
        <h1 className="font-bold text-foreground text-xl mb-3">Search</h1>
        <div className="relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Restaurants, dishes..."
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="px-4 mt-4">
        {query.trim() === "" ? (
          <div>
            <h2 className="font-bold text-foreground text-base mb-3">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {["Burgers", "Pizza", "Sushi", "Chicken", "Healthy", "Coffee", "Desserts", "Pasta"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="bg-card border border-border text-foreground text-sm font-medium px-4 py-2 rounded-full"
                >
                  {tag}
                </button>
              ))}
            </div>

            <h2 className="font-bold text-foreground text-base mt-6 mb-3">All Restaurants</h2>
            <div className="grid grid-cols-2 gap-3">
              {RESTAURANTS.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-foreground">No results found</p>
            <p className="text-muted-foreground text-sm mt-1">Try "{query}" in a different way</p>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground text-sm mb-3">{results.length} results for "{query}"</p>
            <div className="grid grid-cols-2 gap-3">
              {results.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
