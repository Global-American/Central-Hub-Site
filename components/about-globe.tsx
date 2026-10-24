"use client";

import { MapPin } from "lucide-react";
import LogisticsGlobe from "@/components/logistics-globe";
import { globeHubs } from "@/lib/warehouse-locations";

// Brand palette
const NAVY = "#1F447B";
const MARKER_RED = "#E53935";

export default function AboutGlobe({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-[560px] mx-auto ${className}`}>
      <div
        className="relative w-full aspect-square"
        role="img"
        aria-label="Interactive globe showing our facilities and shipping lanes"
      >
        {/* Soft halo behind the globe */}
        <div
          className="pointer-events-none absolute inset-[6%] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(31,68,123,0.22) 0%, rgba(235,153,60,0.12) 55%, rgba(255,255,255,0) 72%)",
          }}
        />

        <LogisticsGlobe
          hubs={globeHubs}
          className="absolute inset-0"
          fallback={
            <img
              src="/images/globe-jig.png"
              alt="Global Logistics Solutions"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          }
        />
      </div>

      {/* Legend */}
      <div
        className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs"
        style={{ color: "#324A6D" }}
      >
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" fill={MARKER_RED} stroke="#ffffff" strokeWidth={1.5} />
          Our facilities
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-1 w-5 rounded-full bg-[#3C91FC]"
          />
          Shipping lanes
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 opacity-70">
          Drag to explore
        </span>
      </div>
    </div>
  );
}
