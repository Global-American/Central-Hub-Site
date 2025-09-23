import HeaderNav from "@/components/header-nav";
import ContactSectionV3 from "@/components/contact-section-v3";
import Footer from "@/components/footer";

export const metadata = {
  title: "Contact Us v3 - Global American LLC",
  description:
    "Get in touch with Global American LLC for all your logistics needs. We'll respond within 2 hours.",
};

export default function ContactV3Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeaderNav />
      <main className="flex-1">
        <ContactSectionV3 />
      </main>
      <Footer />
    </div>
  );
}
