// app/admin/(dashboard)/settings/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { Check, Trash2, Volume2 } from "lucide-react";

export default function AdminSettingsPage() {
  const storyAudio = useQuery(api.settings.getStoryAudio);
  const setStoryAudio = useMutation(api.settings.setStoryAudio);
  const clearStoryAudio = useMutation(api.settings.clearStoryAudio);

  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleUploaded = async (storageId: Id<"_storage">) => {
    setBusy(true);
    setError(null);
    try {
      await setStoryAudio({ storageId });
      flashSaved();
    } catch (err) {
      console.error(err);
      setError("That file could not be saved. Try uploading it again.");
    } finally {
      setBusy(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Remove the Our Story audio? The page will fall back to a sound sample from the catalogue.")) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await clearStoryAudio({});
      flashSaved();
    } catch (err) {
      console.error(err);
      setError("That could not be removed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-sans text-2xl font-semibold text-ink">Settings</h1>
          <p className="mt-1 font-sans text-sm text-ink/50">Store-wide options.</p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 font-sans text-xs text-emerald-600">
            <Check size={14} strokeWidth={2.5} /> Saved
          </span>
        )}
      </div>

      <section className="mt-8 border border-ink/10 bg-white p-6">
        <div className="flex items-start gap-2.5">
          <Volume2 size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-brass" />
          <div>
            <h2 className="font-sans text-sm font-semibold text-ink">Our Story audio</h2>
            <p className="mt-1 max-w-md font-sans text-xs leading-relaxed text-ink/50">
              Plays from the bar at the bottom of the{" "}
              <Link href="/about" className="underline underline-offset-2 hover:text-ink">
                Our Story
              </Link>{" "}
              page when a visitor presses play, and drives the waveform. Use a short
              recording from the room.
            </p>
          </div>
        </div>

        <div className="mt-6">
          {storyAudio === undefined ? (
            <p className="font-sans text-sm text-ink/40">Loading…</p>
          ) : (
            <FileUploadField
              label="Audio file"
              kind="audio"
              currentUrl={storyAudio ?? undefined}
              onUploaded={handleUploaded}
            />
          )}
        </div>

        {error && <p className="mt-3 font-sans text-sm text-oxblood">{error}</p>}

        {storyAudio === null && (
          <p className="mt-4 border-t border-ink/10 pt-4 font-sans text-xs leading-relaxed text-ink/50">
            No audio set. The page is currently falling back to the first product in the
            catalogue that has a sound sample.
          </p>
        )}

        {storyAudio && (
          <button
            type="button"
            onClick={handleClear}
            disabled={busy}
            className="mt-5 flex items-center gap-1.5 border border-oxblood/30 px-4 py-2 font-sans text-xs font-medium uppercase tracking-[0.08em] text-oxblood transition-colors hover:bg-oxblood hover:text-white disabled:opacity-40"
          >
            <Trash2 size={13} />
            Remove audio
          </button>
        )}
      </section>
    </div>
  );
}
