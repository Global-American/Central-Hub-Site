import HeaderNav from "@/components/header-nav";
import HeroSection from "@/components/hero-section";
import OurBrandsSection from "@/components/our-brands-section";
import TestimonialsSection from "@/components/testimonials-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/Footer";
import { Package, Ship, MapPin, Plane, Warehouse } from "lucide-react";

// Horizontal Icon Divider Component with Infinite Animation
function HorizontalDivider({
  Icon,
  className = "",
}: {
  Icon: React.ComponentType<any>;
  className?: string;
}) {
  return (
    <div
      className={`py-12 bg-gradient-to-r from-[#f6fdfe] via-[#ffffff] to-[#f6fdfe] border-t border-b border-muted/20 overflow-hidden transition-all duration-300 ${className}`}
    >
      <div className="relative w-full">
        {/* Single line of infinitely repeating icons */}
        <div className="flex items-center animate-scroll-infinite opacity-60">
          {/* First set of icons */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={`icon-${i}`} className="flex-shrink-0 mx-12">
              <Icon size={24} className="text-accent" />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={`icon-duplicate-${i}`} className="flex-shrink-0 mx-12">
              <Icon size={24} className="text-accent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GlobalAmericanLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeaderNav />
      <main className="flex-1">
        <HeroSection />
        <HorizontalDivider Icon={Ship} className="-mt-1 py-3" />
        <OurBrandsSection />
        <HorizontalDivider Icon={Plane} className="py-3" />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
}
