// app/(storefront)/about/page.tsx
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TextReveal } from "@/components/TextReveal";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StoryStats } from "@/components/StoryStats";
import { StoryReel, type ReelChapter } from "@/components/story/StoryReel";
import { SessionTransport } from "@/components/story/SessionTransport";
import { SignalChain } from "@/components/story/SignalChain";
import { LinerNote } from "@/components/story/LinerNote";
import { RoomGallery } from "@/components/story/RoomGallery";
import { Tracklist } from "@/components/story/Tracklist";

const STORY_ID = "the-session";

// Timecodes rather than 01/02/03: the page is framed as a recording and the
// transport bar genuinely tracks position through it. Each id is an anchor
// the transport can jump to.
const MARKERS = [
  { id: "cut-problem", timecode: "00:00", label: "The problem" },
  { id: "cut-reel", timecode: "01:12", label: "The session" },
  { id: "cut-chain", timecode: "03:40", label: "Signal chain" },
  { id: "cut-note", timecode: "05:02", label: "Liner note" },
  { id: "cut-room", timecode: "05:48", label: "The room" },
  { id: "cut-tracklist", timecode: "07:16", label: "Tracklist" },
];

const CHAPTERS: ReelChapter[] = [
  {
    timecode: "01:12",
    label: "The room",
    heading: "We started because photographs make no sound",
    body:
      "Buying an instrument online meant trusting a spec sheet and a stock photo for a decision that is really about how something rings when you strike it. So we took a room, a microphone, and a rule: nothing gets listed until it has been played.",
    image: "https://images.unsplash.com/photo-1544987906-ad992517ff3d?w=1400",
    credit: "The listening room, Cairo",
  },
  {
    timecode: "01:58",
    label: "The wood",
    heading: "Most of what you hear was decided years before we got it",
    body:
      "Spruce that sat drying through several winters behaves differently from spruce that did not. There is no shortcut for that, so we buy from people who do not look for one.",
    image: "https://images.unsplash.com/photo-1579289416573-55ef29dfed62?w=1400",
    credit: "Book-matched back, in from the workshop",
  },
  {
    timecode: "02:31",
    label: "The hands",
    heading: "Every instrument passes through someone who plays it",
    body:
      "Necks get checked for relief, actions get set, tuning stability gets tested over days rather than minutes. The person who signs it off is a player, not a picker in a warehouse.",
    image: "https://images.unsplash.com/photo-1497219055242-93359eeed651?w=1400",
    credit: "Setup bench",
  },
  {
    timecode: "03:04",
    label: "The take",
    heading: "Then we record the one you are actually buying",
    body:
      "Not the model. Not a demo of something similar. The exact instrument sitting in our room, captured the way it sounded that morning, with no edits and nothing sweetened afterwards.",
    image: "https://images.unsplash.com/photo-1504148591118-0a532fa91a01?w=1400",
    credit: "Take one",
  },
  {
    timecode: "03:29",
    label: "The handover",
    heading: "And you decide with your ears before you spend anything",
    body:
      "You listen, you order, and you pay the courier at your door. If the room was honest about how it sounds, the rest does not need a sales pitch.",
    image: "https://images.unsplash.com/photo-1598090854937-9fc55eaebdf6?w=1400",
    credit: "Packed and going out",
  },
];

const PROMISES = [
  {
    title: "You hear it first",
    body: "A recording of the exact instrument, attached to its own listing.",
  },
  {
    title: "You pay at the door",
    body: "Cash on delivery anywhere in Egypt. Nothing is charged up front.",
  },
  {
    title: "You get it set up",
    body: "Inspected, adjusted and tuned before it ever leaves the room.",
  },
];

export default function AboutPage() {
  // The transport plays a real sample from the catalogue, so this page
  // demonstrates the feature instead of describing it.
  const catalogue = useQuery(api.products.list, {
    paginationOpts: { numItems: 20, cursor: null },
  });
  const track = catalogue?.page.find((p) => p.sound);

  return (
    <div className="w-full bg-ink">
      <SmoothScroll />

      <div id={STORY_ID}>
        {/* Hero — the control room */}
        <section className="relative flex min-h-[88vh] items-center px-4 pb-28 pt-20 text-ivory sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-[1600px]">
            <p className="label text-brass">Our story</p>

            <h1 className="display-xl mt-6 max-w-[14ch] text-[clamp(2.5rem,8vw,7rem)] text-ivory">
              Every instrument we sell was heard first
            </h1>

            <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-ivory/60">
              Jamora Vibes is a listening room in Cairo that happens to sell what it records.
              This page is a session — press play on the bar below and read along.
            </p>

            {track && (
              <p className="mt-7 flex items-center gap-2.5 font-mono text-xs text-ivory/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass" />
                Cued — {track.name}
              </p>
            )}
          </div>
        </section>

        {/* The problem, revealed word by word as you arrive on it */}
        <section id="cut-problem" className="px-4 py-28 sm:px-6 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-4xl">
            <TextReveal
              text="An instrument is the one purchase where the photograph tells you almost nothing. You can read the spec sheet twice and still have no idea whether the thing will sound like anything at all in your hands."
              className="display-md text-[clamp(1.5rem,3.4vw,2.75rem)] text-ivory"
            />
          </div>
        </section>

        {/* The reel — pinned, travelling sideways like tape past the head */}
        <div id="cut-reel">
          <StoryReel id="session-reel" chapters={CHAPTERS} />
        </div>

        <div id="cut-chain">
          <SignalChain />
        </div>

        <div id="cut-note">
          <LinerNote />
        </div>

        <div id="cut-room">
          <RoomGallery />
        </div>

        <div id="cut-tracklist">
          <Tracklist />
        </div>
      </div>

      {/* The release — the instrument leaves the room and daylight arrives */}
      <section className="bg-paper px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1600px]">
          <ScrollReveal className="max-w-3xl">
            <p className="label text-graphite">The release</p>
            <h2 className="display-lg mt-3 text-[clamp(1.85rem,4vw,3.25rem)] text-ink">
              What that means when you order
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-3">
            {PROMISES.map((promise) => (
              <div key={promise.title} className="bg-paper p-7 lg:p-9">
                <h3 className="display-md text-lg text-ink">{promise.title}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-graphite">
                  {promise.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 border-t border-line pt-16">
            <StoryStats />
          </div>

          <div className="mt-20 flex flex-col items-start gap-6 border-t border-line pt-16 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="display-lg max-w-lg text-[clamp(1.5rem,3vw,2.5rem)] text-ink">
              Go and hear something.
            </h2>
            <Link
              href="/instruments"
              className="shrink-0 rounded-full bg-ink px-8 py-4 font-sans text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
            >
              Browse instruments
            </Link>
          </div>
        </div>
      </section>

      <SessionTransport soundUrl={track?.sound} markers={MARKERS} targetId={STORY_ID} />
    </div>
  );
}
