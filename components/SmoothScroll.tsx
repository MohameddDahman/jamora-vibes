// components/SmoothScroll.tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Mounts buttery-smooth inertia scrolling for as long as its host page is
// mounted, and keeps GSAP's ScrollTrigger perfectly in sync with it. Scoped
// per-page (mount/unmount) rather than global, so the rest of the storefront
// keeps native scroll.
export function SmoothScroll() {
  useEffect(() => {
    // Mobile browsers fire resize events for things like the address bar
    // hiding/showing on scroll — without this, GSAP's ScrollTrigger would
    // recalculate pinned-section positions mid-scroll and can jump the
    // page unexpectedly.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
