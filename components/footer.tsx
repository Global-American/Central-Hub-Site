import Link from "next/link"
import Image from "next/image"
import { Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#f6fdfe] text-foreground py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="mb-6">
              <Image
                src="/images/logo.png"
                alt="Global American LLC"
                width={240}
                height={80}
                className="h-14 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Smart logistics solutions that move industries forward.
              <br />
              Your trusted partner in intelligent supply chain management.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="LinkedIn" className="text-primary/80 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h4 className="text-lg font-medium text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#brands" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Global American LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
