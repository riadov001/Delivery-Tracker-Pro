import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { BottomNav } from "@/components/BottomNav";
import Home from "@/pages/Home";
import Restaurant from "@/pages/Restaurant";
import Cart from "@/pages/Cart";
import Search from "@/pages/Search";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";

const queryClient = new QueryClient();

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/restaurant/:id" component={Restaurant} />
      <Route path="/cart" component={Cart} />
      <Route path="/orders" component={Orders} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
      <Route>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-3">😕</p>
            <p className="font-bold text-foreground text-lg">Page not found</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function AppShell() {
  return (
    <div className="max-w-lg mx-auto relative min-h-screen">
      <Router />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WouterRouter base={base}>
            <AppShell />
          </WouterRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
