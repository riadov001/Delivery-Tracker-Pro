import { useLocation } from "wouter";
import { User, MapPin, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MENU_ITEMS = [
  { icon: MapPin, label: "Saved Addresses", description: "Home, Work, Other" },
  { icon: CreditCard, label: "Payment Methods", description: "Add or manage cards" },
  { icon: Bell, label: "Notifications", description: "Delivery & promotions" },
  { icon: Star, label: "Favourites", description: "Your saved restaurants" },
  { icon: HelpCircle, label: "Help & Support", description: "FAQs, contact us" },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={36} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Sign in to your account</h2>
          <p className="text-muted-foreground text-sm mb-6">Track orders, save addresses & manage payments</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full max-w-xs bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-base"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full max-w-xs mt-3 bg-muted text-foreground py-3.5 rounded-xl font-bold text-base"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-4 pt-10 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full" />
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{user.name[0].toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">{user.name}</h1>
            <p className="text-white/70 text-sm">{user.email}</p>
            <span className="mt-1 inline-block text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 -mt-4 bg-card rounded-2xl border border-border p-4 shadow-sm">
        <div className="grid grid-cols-3 divide-x divide-border text-center">
          <div>
            <p className="font-bold text-foreground text-lg">12</p>
            <p className="text-muted-foreground text-xs">Orders</p>
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">4.9</p>
            <p className="text-muted-foreground text-xs">Rating</p>
          </div>
          <div>
            <p className="font-bold text-primary text-lg">$8</p>
            <p className="text-muted-foreground text-xs">Saved</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mx-4 mt-4 bg-card rounded-2xl border border-border overflow-hidden">
        {MENU_ITEMS.map(({ icon: Icon, label, description }, idx) => (
          <div key={label}>
            <button className="flex items-center gap-3 p-4 w-full text-left active:bg-muted transition-colors">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{label}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            {idx < MENU_ITEMS.length - 1 && <div className="h-px bg-border ml-16" />}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-4 mt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 w-full bg-destructive/10 rounded-2xl text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut size={16} className="text-destructive" />
          </div>
          <span className="font-semibold text-destructive text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
