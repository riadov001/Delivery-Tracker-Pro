import { useLocation } from "wouter";
import { Package, Clock, CheckCircle, Bike } from "lucide-react";

const MOCK_ORDERS = [
  {
    id: "ORD-7HX2K",
    restaurant: "Burger Palace",
    emoji: "🍔",
    items: ["Classic Smash Burger ×2", "Crispy Fries"],
    total: 30.97,
    status: "DELIVERED",
    date: "Today, 14:32",
  },
  {
    id: "ORD-3PQ9A",
    restaurant: "Sakura Sushi",
    emoji: "🍣",
    items: ["Dragon Roll", "Salmon Nigiri ×2", "Miso Soup"],
    total: 36.96,
    status: "PREPARING",
    date: "Today, 13:15",
  },
  {
    id: "ORD-1MZ4R",
    restaurant: "La Piazza",
    emoji: "🍕",
    items: ["Margherita", "Tiramisu"],
    total: 20.98,
    status: "DELIVERED",
    date: "Yesterday, 19:45",
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", color: "text-[hsl(47_100%_27%)] bg-[hsl(47_100%_90%)]", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "text-accent bg-accent/10", icon: CheckCircle },
  PREPARING: { label: "Preparing", color: "text-primary bg-primary/10", icon: Package },
  READY_FOR_PICKUP: { label: "Ready for pickup", color: "text-[hsl(73_100%_24%)] bg-[hsl(73_50%_90%)]", icon: Package },
  PICKED_UP: { label: "On the way", color: "text-accent bg-accent/10", icon: Bike },
  DELIVERED: { label: "Delivered", color: "text-[hsl(73_100%_24%)] bg-[hsl(73_50%_90%)]", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "text-destructive bg-destructive/10", icon: Package },
};

export default function Orders() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-10 pb-4">
        <h1 className="font-bold text-foreground text-xl">My Orders</h1>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {MOCK_ORDERS.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-semibold text-foreground text-lg">No orders yet</p>
            <p className="text-muted-foreground text-sm mt-1">Your order history will appear here</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm"
            >
              Start ordering
            </button>
          </div>
        ) : (
          MOCK_ORDERS.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={order.id} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">
                      {order.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{order.restaurant}</p>
                      <p className="text-muted-foreground text-xs">{order.date}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
                    <StatusIcon size={11} />
                    {cfg.label}
                  </span>
                </div>
                <div className="bg-muted rounded-xl px-3 py-2 mb-3">
                  <p className="text-xs text-muted-foreground">{order.items.join(" · ")}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-foreground">${order.total.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/")}
                      className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg"
                    >
                      Reorder
                    </button>
                    <button className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
                      Details
                    </button>
                  </div>
                </div>

                {/* Progress bar for active orders */}
                {order.status === "PREPARING" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Order confirmed</span>
                      <span>Preparing</span>
                      <span className="text-muted-foreground/50">On the way</span>
                      <span className="text-muted-foreground/50">Delivered</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "40%" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
