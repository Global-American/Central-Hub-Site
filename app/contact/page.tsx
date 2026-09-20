import BackgroundFade from "@/components/background-fade";
import HeaderNav from "@/components/header-nav";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact Us - Global American LLC",
  description:
    "Get in touch with Global American LLC for all your logistics needs. We'll respond within 2 hours.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col text-foreground">
      <HeaderNav />
      <main className="relative">
        <BackgroundFade />
        <ContactSection />
      </main>
    </div>
  );
}
