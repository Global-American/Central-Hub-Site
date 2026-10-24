import HeaderNav from "@/components/header-nav";
import HeroSection from "@/components/hero-section";
import OurBrandsSection from "@/components/our-brands-section";
import TestimonialsSection from "@/components/testimonials-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/Footer";

export default function GlobalAmericanLandingPage() {
  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <HeaderNav />
      <main className="flex-1">
        <HeroSection />
        {/* Background fade begins after the hero and ends at the CTA banner */}
        <div className="relative">
          <OurBrandsSection />
          <TestimonialsSection />
        </div>
        <CTASection />
      </main>
    </div>
  );
}
