// lib/cartToast.ts
"use client";

import { useEffect } from "react";

export type ToastItem = {
  name: string;
  image: string;
  price: number;
};

// A tiny pub/sub kept separate from CartContext on purpose: cart *data*
// (items, quantities, totals) and the "hey, that worked" notification are
// different concerns. Any future "quick add" button anywhere in the app can
// call notifyAddedToCart and the toast just works, without wiring props
// through the tree.
type Listener = (item: ToastItem) => void;
const listeners = new Set<Listener>();

export function notifyAddedToCart(item: ToastItem) {
  listeners.forEach((listener) => listener(item));
}

export function useCartToastListener(onAdd: Listener) {
  useEffect(() => {
    listeners.add(onAdd);
    return () => {
      listeners.delete(onAdd);
    };
  }, [onAdd]);
}
