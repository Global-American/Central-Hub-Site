"use client";

import { useEffect, useRef } from "react";

// Size of the parcel riding the front of the bar, in px
const PARCEL = 16;
const BAR_BLUE = "#134E90";

// Bar along the top of the window showing how far down the page you are, with
// our parcel at its leading end, as if the parcel is laying the bar down
// behind it. The bar is revealed with a clip rather than resized.
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const parcelRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bar = barRef.current;
      const parcel = parcelRef.current;
      if (!bar || !parcel) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      // Keep the parcel fully on screen at both ends; the bar runs in under it
      // and stops at its middle, so it always trails out from behind the parcel
      const parcelX = progress * (bar.clientWidth - PARCEL);
      parcel.style.transform = `translateX(${parcelX}px)`;
      bar.style.clipPath = `inset(0 ${bar.clientWidth - (parcelX + PARCEL / 2)}px 0 0)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Page height changes as images and sections load in
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, []);

  // Sits in the 16px strip above the floating nav: a 14px bar centred in it,
  // with the parcel filling the strip
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-4">
      <div
        ref={barRef}
        className="absolute inset-x-0 top-px h-[14px]"
        style={{ clipPath: "inset(0 100% 0 0)", backgroundColor: BAR_BLUE }}
      />
      <img
        ref={parcelRef}
        src="/images/parcel-icon.png"
        alt=""
        width={PARCEL}
        height={PARCEL}
        className="absolute left-0 top-0 drop-shadow-sm"
      />
    </div>
  );
}
