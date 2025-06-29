import HeaderNav from "@/components/header-nav"
import HeroSection from "@/components/hero-section"
import VideoSection from "@/components/video-section"
import OurBrandsSection from "@/components/our-brands-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import { Package, Ship, MapPin } from "lucide-react"

// Horizontal Icon Divider Component
function HorizontalDivider({ Icon, className = "" }: { Icon: React.ComponentType<any>, className?: string }) {
  return (
    <div className={`py-12 bg-muted/20 border-t border-b border-muted/30 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-12 opacity-60">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <Icon size={24} className="text-accent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
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
        <HorizontalDivider Icon={MapPin} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
