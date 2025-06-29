"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Truck, Ship, Package, RotateCcw, ArrowRight, Menu, X } from "lucide-react"

const solutions = [
  {
    name: "ShipItSmart",
    title: "Global Shipping Simplified",
    description: "Smart shipping solutions with global carrier connections and real-time tracking.",
    icon: <Ship className="h-6 w-6" />,
    color: "from-orange-600 to-orange-800",
    bgColor: "bg-gradient-to-br from-orange-600 to-orange-800",
    textColor: "text-white",
    href: "#brands"
  },
  {
    name: "FreightItSmart", 
    title: "Smarter Freight Solutions",
    description: "AI-driven freight optimization with comprehensive carrier network access.",
    icon: <Truck className="h-6 w-6" />,
    color: "from-blue-600 to-blue-800",
    bgColor: "bg-gradient-to-br from-blue-600 to-blue-800",
    textColor: "text-white",
    href: "#brands"
  },
  {
    name: "ReturnItSmart",
    title: "Seamless Returns Process", 
    description: "Intelligent reverse logistics that transforms returns into customer satisfaction.",
    icon: <RotateCcw className="h-6 w-6" />,
    color: "from-orange-600 to-orange-800",
    bgColor: "bg-gradient-to-br from-orange-600 to-orange-800",
    textColor: "text-white",
    href: "#brands"
  },
  {
    name: "FulfillItSmart",
    title: "End-to-End Fulfillment",
    description: "Complete fulfillment solutions that scale with your business growth.",
    icon: <Package className="h-6 w-6" />,
    color: "from-blue-600 to-blue-800",
    bgColor: "bg-gradient-to-br from-blue-600 to-blue-800",
    textColor: "text-white",
    href: "#brands"
  }
]

export default function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md border-b border-gray-100">
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
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#about"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            About
          </Link>
          
          {/* Solutions Dropdown */}
          <div 
            ref={dropdownRef}
            className="relative static"
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={() => setIsDropdownOpen(true)}
              className={`text-base font-medium ${isDropdownOpen ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors flex items-center gap-2 py-2`}
            >
              Solutions
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Full-width Simplified Dropdown */}
            <div 
              className={`fixed left-0 right-0 top-[80px] z-50 transition-all duration-300 ${
                isDropdownOpen 
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                  : 'opacity-0 invisible translate-y-2 pointer-events-none'
              }`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="w-full bg-white shadow-md border-t border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {solutions.map((solution, index) => (
                      <Link
                        key={solution.name}
                        href={solution.href}
                        className="group flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className={`flex-shrink-0 p-2 rounded-md text-white bg-gradient-to-br ${solution.color}`}>
                          {solution.icon}
                        </div>
                        <div>
                          <h4 className={`text-base font-bold text-foreground group-hover:text-primary transition-colors`}>
                            {solution.name}
                          </h4>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {solution.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href="#contact"
                      className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors text-sm"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Contact us to learn more about our solutions
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Link
            href="#contact"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Contact
          </Link>
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md hover:shadow-lg transition-shadow px-6 py-2.5"
          >
            <Link href="#contact">Get Quote</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-accent text-accent-foreground border-accent hover:bg-accent/90"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-x-0 top-[80px] z-40 bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
          : 'opacity-0 invisible -translate-y-2 pointer-events-none'
      }`}>
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-4">
            <Link
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              About
            </Link>
            
            {/* Mobile Solutions */}
            <div className="space-y-3">
              <button
                onClick={() => setIsMobileSolutionsOpen(!isMobileSolutionsOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="text-lg font-semibold text-foreground">Solutions</h4>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                  isMobileSolutionsOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isMobileSolutionsOpen 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-3 pl-4 pt-2">
                  {solutions.map((solution) => (
                    <Link
                      key={solution.name}
                      href={solution.href}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsMobileSolutionsOpen(false)
                      }}
                      className="flex items-center gap-3 py-2"
                    >
                      <div className={`flex-shrink-0 p-2 rounded-md text-white bg-gradient-to-br ${solution.color}`}>
                        {solution.icon}
                      </div>
                      <div>
                        <h5 className="text-base font-bold text-foreground">
                          {solution.name}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {solution.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Contact
            </Link>
          </div>
          
          {/* Mobile CTA Button */}
          <div className="pt-4 border-t border-gray-100">
            <Button
              asChild
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md hover:shadow-lg transition-shadow py-3"
            >
              <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Get Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
