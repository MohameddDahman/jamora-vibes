// app/admin/shipping/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EGYPT_GOVERNORATES, DEFAULT_SHIPPING_FEE } from "@/lib/governorates";
import { Check } from "lucide-react";

function RateRow({ governorate, savedFee }: { governorate: string; savedFee: number }) {
  const upsertRate = useMutation(api.shipping.upsertRate);
  const [value, setValue] = useState(String(savedFee));
  const [justSaved, setJustSaved] = useState(false);

  // Keep the field in sync if the underlying data changes elsewhere
  // (e.g. another tab), but don't clobber what the admin is mid-typing.
  useEffect(() => {
    setValue(String(savedFee));
  }, [savedFee]);

  const numericValue = Number(value);
  const dirty = value.trim() !== "" && !Number.isNaN(numericValue) && numericValue !== savedFee;

  const handleSave = async () => {
    if (Number.isNaN(numericValue) || numericValue < 0) return;
    await upsertRate({ governorate, fee: numericValue });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  return (
    <tr className="border-b border-ink/5 last:border-0">
      <td className="px-4 py-2.5 font-sans text-sm text-ink">{governorate}</td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && dirty && handleSave()}
            className="w-24 border border-ink/15 bg-white px-2.5 py-1.5 font-mono text-sm text-ink focus:border-brass focus:outline-none"
          />
          <span className="font-sans text-xs text-ink/40">L.E</span>
        </div>
      </td>
      <td className="px-4 py-2.5 text-right">
        {justSaved ? (
          <span className="inline-flex items-center gap-1 font-sans text-xs text-emerald-600">
            <Check size={13} strokeWidth={2.5} /> Saved
          </span>
        ) : (
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-brass transition-opacity hover:opacity-70 disabled:opacity-30"
          >
            Save
          </button>
        )}
      </td>
    </tr>
  );
}

export default function AdminShippingPage() {
  const rates = useQuery(api.shipping.list);

  return (
    <div>
      <h1 className="font-sans text-2xl font-semibold text-ink">Shipping Rates</h1>
      <p className="mt-1 max-w-lg font-sans text-sm leading-relaxed text-ink/50">
        Flat cash-on-delivery shipping fee charged per governorate at checkout. Any governorate without a
        saved rate falls back to {DEFAULT_SHIPPING_FEE} L.E.
      </p>

      <div className="mt-8 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/10 font-sans text-xs uppercase tracking-[0.08em] text-ink/40">
              <th className="px-4 py-3 font-medium">Governorate</th>
              <th className="px-4 py-3 font-medium">Fee</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rates === undefined
              ? null
              : EGYPT_GOVERNORATES.map((governorate) => (
                  <RateRow
                    key={governorate}
                    governorate={governorate}
                    savedFee={rates.find((r) => r.governorate === governorate)?.fee ?? DEFAULT_SHIPPING_FEE}
                  />
                ))}
          </tbody>
        </table>

        {rates === undefined && (
          <p className="px-4 py-8 text-center font-sans text-sm text-ink/40">Loading…</p>
        )}
      </div>
    </div>
  );
}
