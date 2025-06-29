"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="transition-opacity hover:opacity-80"
        >
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="Global American LLC"
              width={240}
              height={80}
              className="h-14 w-auto"
              priority
            />
          </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Services
          </Link>
          <Link
            href="#brands"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Our Brands
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-md shadow-md hover:shadow-lg transition-shadow"
          >
            <Link href="#contact">Get Quote</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            className="bg-transparent text-zinc-900 border-zinc-300 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
