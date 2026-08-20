// components/story/SessionTransport.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const BAR_COUNT = 96;

/**
 * The page's signature.
 *
 * At rest this reads as a decorative waveform tracking how far you've scrolled
 * through the story. Press play and it stops being decoration: a real
 * AnalyserNode drives the same bars from the audio that's actually playing.
 *
 * The resting shape is derived deterministically from the bar index (never
 * Math.random) so server and client render identical markup.
 */
function restingHeight(i: number) {
  const a = Math.sin(i * 0.37) * 0.5 + 0.5;
  const b = Math.sin(i * 0.11 + 1.7) * 0.5 + 0.5;
  // Rounded on purpose: React serialises inline-style floats at different
  // precision on the server than in the browser, which trips a hydration
  // mismatch unless both sides produce an identical string.
  return Number((0.18 + a * 0.45 + b * 0.3).toFixed(4));
}

export type Marker = { id: string; timecode: string; label: string };

export function SessionTransport({
  soundUrl,
  markers,
  targetId,
}: {
  soundUrl?: string;
  markers: Marker[];
  targetId: string;
}) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [live, setLive] = useState(false);

  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  // Scroll position through the pinned story section.
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById(targetId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  const stopAnalysis = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    barsRef.current.forEach((el, i) => {
      if (el) el.style.transform = `scaleY(${restingHeight(i)})`;
    });
  }, []);

  // Live analysis loop, only while audio is actually playing.
  const startAnalysis = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    let silentFrames = 0;

    const tick = () => {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < BAR_COUNT; i++) {
        const bin = Math.floor((i / BAR_COUNT) * data.length * 0.7);
        const v = data[bin] / 255;
        sum += v;
        const el = barsRef.current[i];
        if (el) el.style.transform = `scaleY(${Math.max(0.06, v * 1.7)})`;
      }
      // A persistently silent analyser means the stream is CORS-tainted.
      // Drop back to the resting shape instead of showing a dead flat line.
      silentFrames = sum === 0 ? silentFrames + 1 : 0;
      if (silentFrames > 45) {
        setLive(false);
        stopAnalysis();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopAnalysis]);

  useEffect(() => () => stopAnalysis(), [stopAnalysis]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      setLive(false);
      stopAnalysis();
      return;
    }

    // AudioContext needs a user gesture, and createMediaElementSource may
    // only ever be called once for a given element.
    try {
      if (!ctxRef.current) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (Ctor) {
          const ctx = new Ctor();
          const source = ctx.createMediaElementSource(audio);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.75;
          source.connect(analyser);
          analyser.connect(ctx.destination);
          ctxRef.current = ctx;
          analyserRef.current = analyser;
        }
      }
      await ctxRef.current?.resume();
    } catch {
      // Analysis unavailable; playback still works and bars stay at rest.
      analyserRef.current = null;
    }

    await audio.play();
    setPlaying(true);
    if (analyserRef.current) {
      setLive(true);
      startAnalysis();
    }
  };

  const activeIndex = Math.min(
    markers.length - 1,
    Math.floor(progress * markers.length)
  );

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="pointer-events-auto border-t border-ivory/10 bg-ink/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-2.5 sm:gap-6 sm:px-6 lg:px-10">
          {soundUrl && (
            <button
              onClick={toggle}
              aria-label={playing ? "Pause the session" : "Play the session"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass text-ink transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
            >
              {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
          )}

          {/* Decorative until you press play. */}
          <div aria-hidden className="flex h-9 flex-1 items-center gap-[2px] overflow-hidden">
            {Array.from({ length: BAR_COUNT }).map((_, i) => {
              const passed = i / BAR_COUNT <= progress;
              return (
                <span
                  key={i}
                  ref={(el) => {
                    barsRef.current[i] = el;
                  }}
                  style={{ transform: `scaleY(${restingHeight(i)})` }}
                  className={`h-full flex-1 origin-center rounded-full transition-colors duration-300 ${
                    live ? "bg-brass" : passed ? "bg-ivory/70" : "bg-ivory/15"
                  }`}
                />
              );
            })}
          </div>

          {/* Chapter markers double as a table of contents for the session. */}
          <nav aria-label="Jump to a chapter" className="hidden shrink-0 items-center gap-3 lg:flex">
            {markers.map((marker, i) => (
              <button
                key={marker.id}
                onClick={() => jumpTo(marker.id)}
                title={marker.label}
                className={`font-mono text-[0.68rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass ${
                  i === activeIndex ? "text-brass" : "text-ivory/30 hover:text-ivory/70"
                }`}
              >
                {marker.timecode}
              </button>
            ))}
          </nav>

          <span className="shrink-0 font-mono text-[0.7rem] text-brass lg:hidden">
            {markers[activeIndex]?.timecode ?? "00:00"}
          </span>
        </div>
      </div>

      {soundUrl && (
        <audio
          ref={audioRef}
          src={soundUrl}
          crossOrigin="anonymous"
          preload="none"
          loop
          onEnded={() => {
            setPlaying(false);
            setLive(false);
            stopAnalysis();
          }}
        />
      )}
    </div>
  );
}
