// context/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { Id } from "@/convex/_generated/dataModel";

export type CartItem = {
  productId: Id<"products">;
  name: string;
  price: number; // cents, per unit
  image: string;
  quantity: number;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: Id<"products">) => void;
  updateQuantity: (productId: Id<"products">, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "jamora-vibes-cart";
const EMPTY_CART: CartItem[] = [];

// Starts empty on purpose — both server AND the client's first render need
// to agree on "empty" to avoid a hydration mismatch. Real data loads after
// mount, inside CartProvider's effect below.
let cartState: CartItem[] = EMPTY_CART;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cartState;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState));
  } catch {
    // storage unavailable — ignore
  }
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      cartState = JSON.parse(stored);
      emitChange();
    }
  } catch {
    // corrupted/unavailable — stay empty
  }
}

function setCartState(next: CartItem[]) {
  cartState = next;
  persist();
  emitChange();
}

function addItemToStore(item: Omit<CartItem, "quantity">, quantity = 1) {
  const existing = cartState.find((i) => i.productId === item.productId);
  if (existing) {
    const nextQuantity = Math.min(existing.quantity + quantity, existing.stock);
    setCartState(
      cartState.map((i) =>
        i.productId === item.productId ? { ...i, quantity: nextQuantity } : i
      )
    );
  } else {
    setCartState([...cartState, { ...item, quantity: Math.min(quantity, item.stock) }]);
  }
}

function removeItemFromStore(productId: Id<"products">) {
  setCartState(cartState.filter((i) => i.productId !== productId));
}

function updateQuantityInStore(productId: Id<"products">, quantity: number) {
  setCartState(
    cartState.map((i) =>
      i.productId === productId
        ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
        : i
    )
  );
}

function clearCartStore() {
  setCartState(EMPTY_CART);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Deferred on purpose: runs only after the client has committed its first
  // render (which matched the server's empty state), so loading real cart
  // data here can never cause a hydration mismatch — only a clean update
  // right after.
  useEffect(() => {
    loadFromStorage();
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem: addItemToStore,
        removeItem: removeItemFromStore,
        updateQuantity: updateQuantityInStore,
        clearCart: clearCartStore,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}