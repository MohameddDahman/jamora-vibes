// components/CartToast.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCartToastListener, type ToastItem } from "@/lib/cartToast";

const AUTO_DISMISS_MS = 4500;

export function CartToast() {
  const [toast, setToast] = useState<(ToastItem & { key: number }) | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleDismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), AUTO_DISMISS_MS);
  }, []);

  const handleAdd = useCallback(
    (item: ToastItem) => {
      setToast({ ...item, key: Date.now() });
      scheduleDismiss();
    },
    [scheduleDismiss]
  );

  useCartToastListener(handleAdd);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-5 sm:inset-x-auto sm:right-6 sm:justify-end sm:px-0 sm:pb-8">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
            }}
            onMouseLeave={scheduleDismiss}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-4 border border-line bg-paper p-4 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.28)]"
          >
            <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-stage">
              {toast.image && (
                <Image
                  src={toast.image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-contain p-1.5"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-sage">
                <Check size={13} strokeWidth={3} />
                Added to cart
              </p>
              <p className="mt-1.5 truncate font-display text-sm font-bold tracking-tight text-ink">
                {toast.name}
              </p>
              <p className="font-mono text-xs text-graphite">{formatPrice(toast.price)} L.E</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-3">
              <button
                onClick={() => setToast(null)}
                aria-label="Dismiss"
                className="text-graphite transition-colors hover:text-ink"
              >
                <X size={15} />
              </button>
              <Link
                href="/cart"
                onClick={() => setToast(null)}
                className="whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 font-sans text-xs font-semibold text-ivory transition-opacity hover:opacity-90"
              >
                View cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
