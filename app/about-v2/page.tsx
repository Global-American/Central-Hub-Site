import HeaderNav from "@/components/header-nav";
import Footer from "@/components/Footer";
import AboutPageContentV2 from "@/components/about-page-content-v2";

export const metadata = {
  title: "About Us - Global American LLC",
  description:
    "Learn more about Global American LLC, your trusted partner in logistics and freight forwarding solutions worldwide.",
};

export default function AboutPageV2() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeaderNav />
      <main className="flex-1">
        <AboutPageContentV2 />
      </main>
    </div>
  );
}

