import { Link } from "wouter";
import { Star, Clock, Bike } from "lucide-react";
import type { Restaurant } from "@/data/restaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border">
        <div className={`h-40 bg-gradient-to-br ${restaurant.gradient} flex items-center justify-center relative`}>
          <span className="text-6xl drop-shadow-lg">{restaurant.emoji}</span>
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            {restaurant.promoted && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                Sponsored
              </span>
            )}
            {restaurant.isNew && (
              <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                New
              </span>
            )}
            {restaurant.freeDelivery && (
              <span className="bg-[hsl(47_100%_90%)] text-[hsl(42_100%_27%)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Free delivery
              </span>
            )}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-foreground text-sm leading-tight">{restaurant.name}</h3>
          <p className="text-muted-foreground text-xs mt-0.5 truncate">{restaurant.tags.join(" · ")}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-[#F5C518] fill-[#F5C518]" />
              <span className="text-xs font-semibold text-foreground">{restaurant.rating}</span>
              <span className="text-xs text-muted-foreground">({restaurant.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock size={12} />
              <span className="text-xs">{restaurant.deliveryMinutes} min</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bike size={12} />
              <span className="text-xs">
                {restaurant.deliveryFee === 0 ? "Free" : `$${restaurant.deliveryFee.toFixed(2)}`}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Min. ${restaurant.minOrder}</p>
        </div>
      </div>
    </Link>
  );
}
