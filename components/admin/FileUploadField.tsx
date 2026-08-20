// components/admin/FileUploadField.tsx
"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadCloud, X, Loader2 } from "lucide-react";

type Kind = "image" | "audio";

export function FileUploadField({
  label,
  kind,
  currentUrl,
  onUploaded,
  onClear,
  onPreviewUrl,
  required,
}: {
  label: string;
  kind: Kind;
  currentUrl?: string;
  onUploaded: (storageId: Id<"_storage">) => void;
  onClear?: () => void;
  onPreviewUrl?: (url: string | null) => void;
  required?: boolean;
}) {
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setStatus("uploading");
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onPreviewUrl?.(objectUrl);
      onUploaded(storageId);
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const displayUrl = previewUrl ?? currentUrl;

  return (
    <div>
      <label className="block font-sans text-xs font-medium uppercase tracking-[0.08em] text-ink/50">
        {label}
        {required && <span className="text-oxblood"> *</span>}
      </label>

      <div className="mt-2">
        {displayUrl ? (
          <div className="flex items-center gap-3 border border-ink/15 bg-white p-3">
            {kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayUrl} alt="" className="h-16 w-16 shrink-0 rounded-sm object-cover" />
            ) : (
              <audio controls src={displayUrl} className="h-9 max-w-[240px]" />
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={status === "uploading"}
              className="shrink-0 font-sans text-xs font-medium uppercase tracking-[0.08em] text-brass transition-opacity hover:opacity-70 disabled:opacity-40"
            >
              {status === "uploading" ? "Uploading…" : "Replace"}
            </button>
            {onClear && (
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  onClear();
                }}
                aria-label="Remove file"
                className="shrink-0 text-ink/30 transition-colors hover:text-oxblood"
              >
                <X size={15} />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="flex w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/20 bg-white px-4 py-8 text-ink/40 transition-colors hover:border-brass hover:text-brass disabled:opacity-50"
          >
            {status === "uploading" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <UploadCloud size={18} strokeWidth={1.5} />
            )}
            <span className="font-sans text-xs">
              {status === "uploading"
                ? "Uploading…"
                : `Click to upload ${kind === "image" ? "an image" : "an audio file"}`}
            </span>
          </button>
        )}

        {status === "error" && (
          <p className="mt-1.5 font-sans text-xs text-oxblood">Upload failed — please try again.</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={kind === "image" ? "image/*" : "audio/*"}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
