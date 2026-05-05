import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type OrderStatus =
  | "available"
  | "accepted"
  | "picked_up"
  | "delivered";

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLat: number;
  restaurantLng: number;
  customerName: string;
  customerAddress: string;
  customerLat: number;
  customerLng: number;
  items: OrderItem[];
  payout: number;
  tip: number;
  distance: string;
  estimatedMinutes: number;
  status: OrderStatus;
  createdAt: number;
  completedAt?: number;
}

interface EarningEntry {
  day: string;
  amount: number;
  deliveries: number;
}

interface DriverContextType {
  isOnline: boolean;
  toggleOnline: () => void;
  currentOrder: Order | null;
  availableOrders: Order[];
  orderHistory: Order[];
  weeklyEarnings: EarningEntry[];
  todayEarnings: number;
  todayDeliveries: number;
  totalDeliveries: number;
  rating: number;
  acceptOrder: (order: Order) => void;
  declineOrder: (orderId: string) => void;
  advanceOrderStatus: (orderId: string) => void;
}

const DriverContext = createContext<DriverContextType | null>(null);

const RESTAURANTS = [
  { name: "Wagamama", address: "1 Tavistock Street, London", lat: 51.5115, lng: -0.1235 },
  { name: "Nando's", address: "57-59 Wardour Street, London", lat: 51.5128, lng: -0.1325 },
  { name: "Shake Shack", address: "24 The Market, London", lat: 51.5121, lng: -0.1242 },
  { name: "Five Guys", address: "1-3 Long Acre, London", lat: 51.5118, lng: -0.1236 },
  { name: "Dishoom", address: "12 Upper St Martin's Lane", lat: 51.5122, lng: -0.1258 },
  { name: "Patty & Bun", address: "54 James Street, London", lat: 51.5143, lng: -0.1488 },
  { name: "Bleecker Burger", address: "Unit 3 Spitalfields Market", lat: 51.5194, lng: -0.0729 },
  { name: "Leon", address: "3 Crispin Place, London", lat: 51.5196, lng: -0.0728 },
];

const CUSTOMER_ADDRESSES = [
  { address: "45 Baker Street, London", lat: 51.5225, lng: -0.1571 },
  { address: "12 Portobello Road, London", lat: 51.5159, lng: -0.2014 },
  { address: "88 Borough High Street, London", lat: 51.5021, lng: -0.0908 },
  { address: "30 Canary Wharf, London", lat: 51.5054, lng: -0.0235 },
  { address: "7 Brick Lane, London", lat: 51.5215, lng: -0.0714 },
  { address: "15 Camden High Street, London", lat: 51.5390, lng: -0.1426 },
  { address: "22 Shoreditch High Street, London", lat: 51.5245, lng: -0.0780 },
  { address: "91 King's Road, Chelsea, London", lat: 51.4869, lng: -0.1676 },
];

const MENU_ITEMS = [
  ["Chicken Ramen", "Katsu Curry", "Gyoza x4"],
  ["Peri-Peri Chicken", "Fino Pitta", "Macho Peas"],
  ["ShackBurger", "Cheese Fries", "Lemonade"],
  ["Little Bacon Burger", "Cajun Fries", "Milkshake"],
  ["Lamb Chops", "Black Dal", "Naan"],
  ["Original Burger", "Onion Rings", "Rosé Lemonade"],
  ["Double Smash", "Truffle Fries", "Shake"],
  ["Superfood Salad", "Falafel Wrap", "Juice"],
];

function generateOrder(): Order {
  const r = RESTAURANTS[Math.floor(Math.random() * RESTAURANTS.length)];
  const c = CUSTOMER_ADDRESSES[Math.floor(Math.random() * CUSTOMER_ADDRESSES.length)];
  const items = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
  const payout = parseFloat((3.5 + Math.random() * 4).toFixed(2));
  const tip = Math.random() > 0.5 ? parseFloat((0.5 + Math.random() * 2.5).toFixed(2)) : 0;
  const distance = (0.5 + Math.random() * 3.5).toFixed(1);
  const estimatedMinutes = Math.floor(10 + Math.random() * 20);
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 6);

  return {
    id,
    restaurantName: r.name,
    restaurantAddress: r.address,
    restaurantLat: r.lat,
    restaurantLng: r.lng,
    customerName: ["James", "Emily", "Oliver", "Sophie", "Harry", "Amelia"][Math.floor(Math.random() * 6)],
    customerAddress: c.address,
    customerLat: c.lat,
    customerLng: c.lng,
    items: items.map((name) => ({ name, quantity: 1 })),
    payout,
    tip,
    distance,
    estimatedMinutes,
    status: "available",
    createdAt: Date.now(),
  };
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function generateWeeklyEarnings(): EarningEntry[] {
  return DAYS.map((day) => ({
    day,
    amount: parseFloat((15 + Math.random() * 80).toFixed(2)),
    deliveries: Math.floor(3 + Math.random() * 12),
  }));
}

const STORAGE_KEY = "driver_app_state";

export function DriverProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [weeklyEarnings] = useState<EarningEntry[]>(generateWeeklyEarnings);
  const [totalDeliveries, setTotalDeliveries] = useState(247);
  const [rating] = useState(4.87);
  const orderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          const saved = JSON.parse(val);
          if (saved.orderHistory) setOrderHistory(saved.orderHistory);
          if (saved.totalDeliveries) setTotalDeliveries(saved.totalDeliveries);
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ orderHistory, totalDeliveries })
    );
  }, [orderHistory, totalDeliveries]);

  useEffect(() => {
    if (isOnline && !currentOrder) {
      setAvailableOrders([generateOrder()]);
      orderTimerRef.current = setInterval(() => {
        setAvailableOrders((prev) => {
          if (prev.length < 3) {
            return [...prev, generateOrder()];
          }
          return prev;
        });
      }, 15000);
    } else {
      if (orderTimerRef.current) {
        clearInterval(orderTimerRef.current);
        orderTimerRef.current = null;
      }
      if (!isOnline) setAvailableOrders([]);
    }
    return () => {
      if (orderTimerRef.current) {
        clearInterval(orderTimerRef.current);
      }
    };
  }, [isOnline, currentOrder]);

  const toggleOnline = useCallback(() => {
    setIsOnline((prev) => !prev);
  }, []);

  const acceptOrder = useCallback((order: Order) => {
    setCurrentOrder({ ...order, status: "accepted" });
    setAvailableOrders([]);
  }, []);

  const declineOrder = useCallback((orderId: string) => {
    setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const advanceOrderStatus = useCallback((orderId: string) => {
    setCurrentOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      if (prev.status === "accepted") return { ...prev, status: "picked_up" };
      if (prev.status === "picked_up") {
        const completed: Order = { ...prev, status: "delivered", completedAt: Date.now() };
        setOrderHistory((h) => [completed, ...h]);
        setTotalDeliveries((d) => d + 1);
        setTimeout(() => setCurrentOrder(null), 500);
        return completed;
      }
      return prev;
    });
  }, []);

  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayEntry = weeklyEarnings.find((e) => e.day === today);
  const todayEarnings = todayEntry?.amount ?? 0;
  const todayDeliveries = orderHistory.filter(
    (o) =>
      o.completedAt &&
      new Date(o.completedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <DriverContext.Provider
      value={{
        isOnline,
        toggleOnline,
        currentOrder,
        availableOrders,
        orderHistory,
        weeklyEarnings,
        todayEarnings,
        todayDeliveries,
        totalDeliveries,
        rating,
        acceptOrder,
        declineOrder,
        advanceOrderStatus,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export function useDriver() {
  const ctx = useContext(DriverContext);
  if (!ctx) throw new Error("useDriver must be used within DriverProvider");
  return ctx;
}
