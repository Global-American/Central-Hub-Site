import { useId } from "react";
import ItMark from "@/components/icons/it-mark";

// The hanging light bulb that ends the brand card taglines, drawn inline so
// its parts can move: it sways from the top of its cord, and its glow and rays
// flicker. Styles live in globals.css under "Brand card light bulb".
// A variant of public/images/lightbulb.svg for the coloured cards: the same
// orange glass, but a white cord, light metal socket and white rays, which the
// navy ones there would vanish against on the navy cards, plus a white rim and
// glow to keep the glass apart from the orange cards. The viewBox is cropped
// close to the rays; the top of it is the top of the cord.
export default function HangingLightBulb({ className = "" }: { className?: string }) {
  // Gradient ids must be unique per bulb, as there is one on every card
  const id = useId().replace(/[^\w-]/g, "");

  return (
    <svg
      viewBox="24 -40 192 334"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={`hanging-bulb ${className}`}
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="120" cy="190" r="104" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-glass`} cx="100" cy="160" r="105" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD596" />
          <stop offset="0.45" stopColor="#F99E36" />
          <stop offset="1" stopColor="#DE7C1C" />
        </radialGradient>
        <linearGradient id={`${id}-socket`} x1="100" y1="0" x2="140" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B7CBEC" />
          <stop offset="0.3" stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#D6E4FF" />
          <stop offset="1" stopColor="#9DB6E0" />
        </linearGradient>
      </defs>

      <circle className="hanging-bulb-glow" cx="120" cy="190" r="104" fill={`url(#${id}-glow)`} />

      <g className="hanging-bulb-rays" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round">
        <line x1="181.3" y1="138.6" x2="195.1" y2="127.0" />
        <line x1="198.8" y1="176.1" x2="209.6" y2="174.2" />
        <line x1="195.2" y1="217.4" x2="212.1" y2="223.6" />
        <line x1="171.4" y1="251.3" x2="178.5" y2="259.7" />
        <line x1="120" y1="270" x2="120" y2="288" />
        <line x1="68.6" y1="251.3" x2="61.5" y2="259.7" />
        <line x1="44.8" y1="217.4" x2="27.9" y2="223.6" />
        <line x1="41.2" y1="176.1" x2="30.4" y2="174.2" />
        <line x1="58.7" y1="138.6" x2="44.9" y2="127.0" />
      </g>

      {/* Cord and socket */}
      <path d="M120 -38V44" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      <rect x="112" y="40" width="16" height="12" rx="3" fill="#D6E4FF" />
      <path d="M100 66Q100 50 116 50H124Q140 50 140 66V102H100Z" fill={`url(#${id}-socket)`} />
      <g fill="#1F447B" opacity="0.3">
        <rect x="100" y="70" width="40" height="3" />
        <rect x="100" y="80" width="40" height="3" />
        <rect x="100" y="90" width="40" height="3" />
      </g>

      {/* Glass, with the "it" mark as the filament */}
      <path
        d="M102 106C102 130 58 146 58 190A62 62 0 0 0 182 190C182 146 138 130 138 106Z"
        fill={`url(#${id}-glass)`}
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeOpacity="0.85"
      />
      <ItMark x="92.5" y="167.2" width="58.1" height="58.8" fill="#1F447B" />

      {/* Gloss */}
      <ellipse cx="77" cy="174" rx="7" ry="20" transform="rotate(22 77 174)" fill="#FFFFFF" opacity="0.6" />
      <circle cx="88" cy="146" r="4" fill="#FFFFFF" opacity="0.6" />

      {/* Collar between socket and glass */}
      <rect x="96" y="100" width="48" height="12" rx="4" fill="#1F447B" />
    </svg>
  );
}
