import BackgroundFade from "@/components/background-fade";
import HeaderNav from "@/components/header-nav";
import Footer from "@/components/Footer";
import AboutPageContent from "@/components/about-page-content";

export const metadata = {
  title: "About Us - Global American LLC",
  description:
    "Learn more about Global American LLC, your trusted partner in logistics and freight forwarding solutions worldwide.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <HeaderNav />
      <main className="relative flex-1">
        <BackgroundFade />
        <AboutPageContent />
      </main>
    </div>
  );
}
