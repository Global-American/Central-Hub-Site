import HeaderNav from "@/components/header-nav";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export const metadata = {
  title: "Contact Us - Global American LLC",
  description:
    "Get in touch with Global American LLC for all your logistics needs. We'll respond within 2 hours.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeaderNav />
      <main className="flex-1">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
