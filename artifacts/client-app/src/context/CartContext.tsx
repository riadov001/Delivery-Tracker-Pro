import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { MenuItem, Restaurant } from "@/data/restaurants";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  restaurant: Restaurant | null;
}

type CartAction =
  | { type: "ADD_ITEM"; item: MenuItem; restaurant: Restaurant }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "INCREMENT"; itemId: string }
  | { type: "DECREMENT"; itemId: string }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      if (state.restaurant && state.restaurant.id !== action.restaurant.id) {
        return {
          restaurant: action.restaurant,
          items: [{ item: action.item, quantity: 1 }],
        };
      }
      const existing = state.items.find((c) => c.item.id === action.item.id);
      if (existing) {
        return {
          ...state,
          restaurant: action.restaurant,
          items: state.items.map((c) =>
            c.item.id === action.item.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return {
        restaurant: action.restaurant,
        items: [...state.items, { item: action.item, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((c) => c.item.id !== action.itemId),
        restaurant: state.items.length <= 1 ? null : state.restaurant,
      };
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((c) =>
          c.item.id === action.itemId ? { ...c, quantity: c.quantity + 1 } : c
        ),
      };
    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((c) =>
            c.item.id === action.itemId ? { ...c, quantity: c.quantity - 1 } : c
          )
          .filter((c) => c.quantity > 0),
        restaurant:
          state.items.filter((c) => c.item.id !== action.itemId || c.quantity > 1).length === 0
            ? null
            : state.restaurant,
      };
    case "CLEAR":
      return { items: [], restaurant: null };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  restaurant: Restaurant | null;
  totalItems: number;
  subtotal: number;
  addItem: (item: MenuItem, restaurant: Restaurant) => void;
  removeItem: (itemId: string) => void;
  increment: (itemId: string) => void;
  decrement: (itemId: string) => void;
  getQuantity: (itemId: string) => number;
  clear: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], restaurant: null });

  const addItem = useCallback((item: MenuItem, restaurant: Restaurant) =>
    dispatch({ type: "ADD_ITEM", item, restaurant }), []);
  const removeItem = useCallback((itemId: string) =>
    dispatch({ type: "REMOVE_ITEM", itemId }), []);
  const increment = useCallback((itemId: string) =>
    dispatch({ type: "INCREMENT", itemId }), []);
  const decrement = useCallback((itemId: string) =>
    dispatch({ type: "DECREMENT", itemId }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const getQuantity = useCallback(
    (itemId: string) => state.items.find((c) => c.item.id === itemId)?.quantity ?? 0,
    [state.items]
  );

  const totalItems = state.items.reduce((s, c) => s + c.quantity, 0);
  const subtotal = state.items.reduce((s, c) => s + c.item.price * c.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      restaurant: state.restaurant,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      increment,
      decrement,
      getQuantity,
      clear,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
