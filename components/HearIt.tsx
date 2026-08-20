// components/HearIt.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

// Only one sample should ever be audible. Tracking the active element at
// module scope lets a newly-started clip stop whatever was already playing,
// even across separate cards in a grid.
let activeAudio: HTMLAudioElement | null = null;
const activeListeners = new Set<() => void>();

function claimPlayback(audio: HTMLAudioElement) {
  if (activeAudio && activeAudio !== audio) {
    activeAudio.pause();
  }
  activeAudio = audio;
  activeListeners.forEach((notify) => notify());
}

function releasePlayback(audio: HTMLAudioElement) {
  if (activeAudio === audio) activeAudio = null;
  activeListeners.forEach((notify) => notify());
}

type Variant = "solid" | "outline" | "icon";

/**
 * The store's signature control: hear the actual instrument before buying it.
 * Brass is reserved for this affordance and nothing else.
 */
export function HearIt({
  soundUrl,
  variant = "outline",
  label = "Hear it",
  className = "",
}: {
  soundUrl: string;
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Re-check on every global playback change, so a card whose audio was
  // stopped by another card resets its own button state.
  useEffect(() => {
    const sync = () => setPlaying(activeAudio === audioRef.current && !!activeAudio);
    activeListeners.add(sync);
    return () => {
      activeListeners.delete(sync);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        releasePlayback(audio);
      }
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    // Cards wrap this in a link — never navigate when the intent was to listen.
    e.preventDefault();
    e.stopPropagation();

    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      releasePlayback(audio);
      setPlaying(false);
    } else {
      claimPlayback(audio);
      void audio.play();
      setPlaying(true);
    }
  };

  const base =
    "inline-flex items-center justify-center gap-2 font-sans font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass";

  const styles: Record<Variant, string> = {
    solid: "rounded-full bg-brass px-6 py-3 text-sm text-ink hover:bg-brass/90",
    outline:
      "w-full rounded-full border border-brass px-6 py-3 text-sm text-brass hover:bg-brass hover:text-ink",
    icon: "h-8 w-8 rounded-full bg-paper/95 text-brass shadow-sm hover:bg-brass hover:text-ink",
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? `Stop sound sample` : `Play sound sample`}
      title={playing ? "Stop sample" : "Hear this instrument"}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {playing ? <Pause size={variant === "icon" ? 13 : 15} /> : <Play size={variant === "icon" ? 13 : 15} />}
      {variant !== "icon" && <span>{playing ? "Stop" : label}</span>}
      <audio
        ref={audioRef}
        src={soundUrl}
        preload="none"
        onEnded={() => {
          const audio = audioRef.current;
          if (audio) releasePlayback(audio);
          setPlaying(false);
        }}
      />
    </button>
  );
}
