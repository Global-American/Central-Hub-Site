import HeaderNav from "@/components/header-nav";
import ServicesSection from "@/components/services-section";

export const metadata = {
  title: "Services - Global American LLC",
  description:
    "Ship itSmart, Freight itSmart, Return itSmart and Fulfill itSmart: shipping, freight, returns and fulfillment platforms from Global American LLC.",
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <HeaderNav />
      {/* The section's own top padding clears the fixed header */}
      <main className="relative flex-1">
        <ServicesSection />
      </main>
    </div>
  );
}
