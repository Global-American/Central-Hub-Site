import HeaderNav from "@/components/header-nav";
import HeroSection from "@/components/hero-section";
import VideoSection from "@/components/video-section";
import OurBrandsSection from "@/components/our-brands-section";
import TestimonialsSection from "@/components/testimonials-section";
import WarehouseLocationsSection from "@/components/warehouse-locations-section";
import Footer from "@/components/footer";
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
      className={`py-12 bg-[#f6fdfe] border-t border-b border-muted/30 overflow-hidden ${className}`}
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
        <HorizontalDivider Icon={Package} />
        <VideoSection />
        <HorizontalDivider Icon={Ship} />
        <OurBrandsSection />
        <HorizontalDivider Icon={Plane} />
        <TestimonialsSection />
        <HorizontalDivider Icon={MapPin} />
        <WarehouseLocationsSection />
        <HorizontalDivider Icon={Warehouse} />
      </main>
      <Footer />
    </div>
  );
}
