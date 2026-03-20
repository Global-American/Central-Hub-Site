"use client";

import { useEffect, useRef } from "react";
import { Package } from "lucide-react";
import { gsap } from "gsap";

interface AnimatedParcelBorderProps {
  className?: string;
  parcelCount?: number;
  duration?: number;
  offset?: number;
  opacity?: number;
}

export default function AnimatedParcelBorder({
  className = "",
  parcelCount = 48,
  duration = 120,
  offset = 30,
  opacity = 0.3,
}: AnimatedParcelBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const parcels = Array.from(
      container.querySelectorAll(".parcel-icon")
    ) as HTMLElement[];

    if (parcels.length === 0) return;

    const animateParcels = () => {
      // Use offsetWidth/offsetHeight for accurate dimensions
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const iconSize =
        parcels[0]?.querySelector("svg")?.getBoundingClientRect().width || 28;
      const halfIcon = iconSize / 2;

      // Calculate perimeter for even spacing
      const perimeter = (width + height) * 2;
      const totalDuration = duration;

      parcels.forEach((parcel, index) => {
        // Calculate starting position based on perimeter distribution
        const startDistance = (index / parcels.length) * perimeter;
        let startLeft = 0;
        let startTop = 0;

        // Determine which edge the parcel starts on (centered on icon)
        if (startDistance < width) {
          // Top edge
          startLeft = startDistance - halfIcon;
          startTop = -offset - halfIcon;
        } else if (startDistance < width + height) {
          // Right edge
          startLeft = width + offset - halfIcon;
          startTop = startDistance - width - halfIcon;
        } else if (startDistance < width * 2 + height) {
          // Bottom edge
          startLeft = width - (startDistance - width - height) - halfIcon;
          startTop = height + offset - halfIcon;
        } else {
          // Left edge
          startLeft = -offset - halfIcon;
          startTop = height - (startDistance - width * 2 - height) - halfIcon;
        }

        const tl = gsap.timeline({
          repeat: -1,
        });

        // Calculate duration for each side based on its length relative to perimeter
        const topDuration = (width / perimeter) * totalDuration;
        const rightDuration = (height / perimeter) * totalDuration;
        const bottomDuration = (width / perimeter) * totalDuration;
        const leftDuration = (height / perimeter) * totalDuration;

        // Set starting position
        tl.set(parcel, {
          left: startLeft,
          top: startTop,
        });

        // Animate from current position around the border (clockwise)
        if (startDistance < width) {
          // Starting on top edge - move to top-right corner, then continue clockwise
          tl.to(parcel, {
            left: width + offset - halfIcon,
            top: -offset - halfIcon,
            duration: topDuration * ((width - startDistance) / width),
            ease: "none",
          });
          tl.to(parcel, {
            left: width + offset - halfIcon,
            top: height + offset - halfIcon,
            duration: rightDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: -offset - halfIcon,
            top: height + offset - halfIcon,
            duration: bottomDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: -offset - halfIcon,
            top: -offset - halfIcon,
            duration: leftDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: startLeft,
            top: -offset - halfIcon,
            duration: topDuration * (startDistance / width),
            ease: "none",
          });
        } else if (startDistance < width + height) {
          // Starting on right edge
          const rightProgress = (startDistance - width) / height;
          tl.to(parcel, {
            left: width + offset - halfIcon,
            top: height + offset - halfIcon,
            duration: rightDuration * (1 - rightProgress),
            ease: "none",
          });
          tl.to(parcel, {
            left: -offset - halfIcon,
            top: height + offset - halfIcon,
            duration: bottomDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: -offset - halfIcon,
            top: -offset - halfIcon,
            duration: leftDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: width + offset - halfIcon,
            top: -offset - halfIcon,
            duration: topDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: width + offset - halfIcon,
            top: startTop,
            duration: rightDuration * rightProgress,
            ease: "none",
          });
        } else if (startDistance < width * 2 + height) {
          // Starting on bottom edge
          const bottomProgress = (startDistance - width - height) / width;
          tl.to(parcel, {
            left: -offset - halfIcon,
            top: height + offset - halfIcon,
            duration: bottomDuration * (1 - bottomProgress),
            ease: "none",
          });
          tl.to(parcel, {
            left: -offset - halfIcon,
            top: -offset - halfIcon,
            duration: leftDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: width + offset - halfIcon,
            top: -offset - halfIcon,
            duration: topDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: width + offset - halfIcon,
            top: height + offset - halfIcon,
            duration: rightDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: startLeft,
            top: height + offset - halfIcon,
            duration: bottomDuration * bottomProgress,
            ease: "none",
          });
        } else {
          // Left edge
          const leftProgress = (startDistance - width * 2 - height) / height;
          tl.to(parcel, {
            left: -offset - halfIcon,
            top: -offset - halfIcon,
            duration: leftDuration * (1 - leftProgress),
            ease: "none",
          });
          tl.to(parcel, {
            left: width + offset - halfIcon,
            top: -offset - halfIcon,
            duration: topDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: width + offset - halfIcon,
            top: height + offset - halfIcon,
            duration: rightDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: -offset - halfIcon,
            top: height + offset - halfIcon,
            duration: bottomDuration,
            ease: "none",
          });
          tl.to(parcel, {
            left: -offset - halfIcon,
            top: startTop,
            duration: leftDuration * leftProgress,
            ease: "none",
          });
        }
      });
    };

    const timeoutId = setTimeout(animateParcels, 100);

    const handleResize = () => {
      gsap.killTweensOf(parcels);
      setTimeout(animateParcels, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      gsap.killTweensOf(parcels);
      window.removeEventListener("resize", handleResize);
    };
  }, [parcelCount, duration, offset, opacity]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`}>
      {[...Array(parcelCount)].map((_, i) => (
        <div
          key={`parcel-${i}`}
          className="parcel-icon absolute pointer-events-none"
          style={{
            opacity: opacity,
          }}
        >
          <Package className="h-6 w-6 md:h-7 md:w-7 text-[#EB993C]" />
        </div>
      ))}
    </div>
  );
}
