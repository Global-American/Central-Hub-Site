import Link from "next/link"
import { Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-accent-foreground mb-4">Global American LLC</h3>
            <p className="text-sm text-accent-foreground/80 mb-6">
              Innovate. Integrate. Elevate.
              <br />
              Your trusted partner in next-generation logistics.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="LinkedIn" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
          <div className="text-right">
            <h4 className="text-lg font-medium text-accent-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#brands" className="text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Our Brands
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 text-center text-sm text-accent-foreground/80">
          <p>&copy; {new Date().getFullYear()} Global American LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
