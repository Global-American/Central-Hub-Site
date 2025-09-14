import HeaderNav from "@/components/header-nav";
import Footer from "@/components/footer";
import AboutPageContent from "@/components/about-page-content";

export const metadata = {
  title: "About Us - Global American LLC",
  description:
    "Learn more about Global American LLC, your trusted partner in logistics and freight forwarding solutions worldwide.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeaderNav />
      <main className="flex-1">
        <AboutPageContent />
      </main>
      <Footer />
    </div>
  );
}
