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
  const [isGetStartedDropdownOpen, setIsGetStartedDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false)
  const [isMobileGetStartedOpen, setIsMobileGetStartedOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const getStartedDropdownRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Dropdown management with delay
  const handleDropdownOpen = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setIsDropdownOpen(true)
    setIsGetStartedDropdownOpen(false)
  }

  const handleDropdownClose = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 150) // 150ms delay
  }

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
  }

  // Smooth scroll function with better easing
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId.replace('#', ''))
    if (element) {
      const headerOffset = 100 // Height of fixed header + some padding
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Enhanced navigation click handler
  const handleNavClick = (href: string, callback?: () => void) => {
    if (href.startsWith('#')) {
      smoothScrollTo(href)
    }
    if (callback) {
      callback()
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (getStartedDropdownRef.current && !getStartedDropdownRef.current.contains(event.target as Node)) {
        setIsGetStartedDropdownOpen(false)
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white shadow-lg border-b border-gray-100" 
        : "bg-white shadow-sm"
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">GA</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-200">
                Global American
              </h1>
              <p className="text-sm text-muted-foreground -mt-1">Logistics Solutions</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {/* Solutions Dropdown */}
          <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleDropdownOpen}
            onMouseLeave={handleDropdownClose}
          >
            <button
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center py-2 group"
            >
              Solutions
              <ChevronDown className={`h-4 w-4 ml-1 transition-all duration-300 group-hover:text-accent ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Full-width Solutions Dropdown */}
            <div 
              className={`fixed left-0 right-0 top-[80px] z-50 transition-all duration-300 ${
                isDropdownOpen 
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                  : 'opacity-0 invisible translate-y-2 pointer-events-none'
              }`}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownClose}
            >
              <div className="w-full bg-white shadow-xl border-t border-gray-100 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Choose Your Solution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {solutions.map((solution, index) => (
                      <button
                        key={solution.name}
                        onClick={() => {
                          handleNavClick(solution.href, () => setIsDropdownOpen(false))
                        }}
                        className="group text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-accent/20 hover:shadow-lg"
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <div>
                          <h4 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-200 mb-2">
                            {solution.name}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {solution.title}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <button
                      onClick={() => {
                        handleNavClick("#contact", () => setIsDropdownOpen(false))
                      }}
                      className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-all duration-200 text-base group bg-accent/10 hover:bg-accent/20 px-6 py-3 rounded-lg"
                    >
                      Contact us to learn more about our solutions
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => handleNavClick("#about")}
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-200 py-2 hover:text-accent"
            onMouseEnter={() => {
              if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current)
                dropdownTimeoutRef.current = null
              }
              setIsDropdownOpen(false)
              setIsGetStartedDropdownOpen(false)
            }}
          >
            About
          </button>
          
          <button
            onClick={() => handleNavClick("#testimonials")}
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-200 py-2 hover:text-accent"
            onMouseEnter={() => {
              if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current)
                dropdownTimeoutRef.current = null
              }
              setIsDropdownOpen(false)
              setIsGetStartedDropdownOpen(false)
            }}
          >
            Testimonials
          </button>
          
          <button
            onClick={() => handleNavClick("#contact")}
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-200 py-2 hover:text-accent"
            onMouseEnter={() => {
              if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current)
                dropdownTimeoutRef.current = null
              }
              setIsDropdownOpen(false)
              setIsGetStartedDropdownOpen(false)
            }}
          >
            Contact
          </button>
          
          {/* Get Started Dropdown */}
          <div 
            ref={getStartedDropdownRef}
            className="relative"
            onMouseEnter={() => {
              if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current)
                dropdownTimeoutRef.current = null
              }
              setIsGetStartedDropdownOpen(true)
              setIsDropdownOpen(false)
            }}
            onMouseLeave={() => setIsGetStartedDropdownOpen(false)}
          >
            <button
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center py-2"
            >
              Get Started
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${isGetStartedDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Get Started Solutions Dropdown */}
            <div 
              className={`absolute right-0 top-full mt-2 w-72 z-50 transition-all duration-200 ${
                isGetStartedDropdownOpen 
                  ? 'opacity-100 visible translate-y-0' 
                  : 'opacity-0 invisible translate-y-1'
              }`}
              onMouseLeave={() => setIsGetStartedDropdownOpen(false)}
            >
              <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-foreground mb-4">Start Your Journey</h3>
                <div className="space-y-2">
                  {solutions.map((solution) => (
                    <div
                      key={solution.name}
                      className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${
                        solution.name === 'ShipItSmart' 
                          ? 'hover:bg-gray-50 cursor-pointer border border-accent/20' 
                          : 'opacity-40 blur-[1px] cursor-not-allowed'
                      }`}
                    >
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold ${
                          solution.name === 'ShipItSmart' ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {solution.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {solution.name === 'ShipItSmart' ? solution.title : 'Coming Soon'}
                        </p>
                      </div>
                      {solution.name === 'ShipItSmart' && (
                        <Button 
                          size="sm" 
                          className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs px-3 py-1 ml-3"
                          onClick={() => {
                            setIsGetStartedDropdownOpen(false)
                            // Add your login logic here
                          }}
                        >
                          Login
          </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
            {/* Mobile Solutions */}
            <div className="space-y-3">
              <button
                onClick={() => setIsMobileSolutionsOpen(!isMobileSolutionsOpen)}
                className="flex items-center w-full text-left"
              >
                <h4 className="text-lg font-semibold text-foreground">Solutions</h4>
                <ChevronDown className={`h-5 w-5 text-muted-foreground ml-1 transition-transform duration-200 ${
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
                    <button
                      key={solution.name}
                      onClick={() => {
                        handleNavClick(solution.href, () => {
                        setIsMobileMenuOpen(false)
                        setIsMobileSolutionsOpen(false)
                        })
                      }}
                      className="flex items-center gap-3 py-2 w-full text-left hover:bg-gray-50 rounded-lg transition-all duration-200"
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
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleNavClick("#about", () => setIsMobileMenuOpen(false))}
              className="block text-lg font-medium text-muted-foreground hover:text-foreground hover:text-accent transition-all duration-200 py-2 w-full text-left"
            >
              About
            </button>
            
            <button
              onClick={() => handleNavClick("#testimonials", () => setIsMobileMenuOpen(false))}
              className="block text-lg font-medium text-muted-foreground hover:text-foreground hover:text-accent transition-all duration-200 py-2 w-full text-left"
            >
              Testimonials
            </button>
            
            <button
              onClick={() => handleNavClick("#contact", () => setIsMobileMenuOpen(false))}
              className="block text-lg font-medium text-muted-foreground hover:text-foreground hover:text-accent transition-all duration-200 py-2 w-full text-left"
            >
              Contact
            </button>
            
            {/* Mobile Get Started */}
            <div className="space-y-3">
              <button
                onClick={() => setIsMobileGetStartedOpen(!isMobileGetStartedOpen)}
                className="flex items-center w-full text-left"
              >
                <h4 className="text-lg font-semibold text-foreground">Get Started</h4>
                <ChevronDown className={`h-5 w-5 text-muted-foreground ml-1 transition-transform duration-200 ${
                  isMobileGetStartedOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isMobileGetStartedOpen 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-3 pl-4 pt-2">
                  {solutions.map((solution) => (
                    <div
                      key={solution.name}
                      className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${
                        solution.name === 'ShipItSmart' 
                          ? 'bg-gray-50 cursor-pointer border border-accent/20' 
                          : 'opacity-40 blur-[1px] cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (solution.name === 'ShipItSmart') {
                          setIsMobileMenuOpen(false)
                          setIsMobileGetStartedOpen(false)
                          // Add your login logic here
                        }
                      }}
                    >
                      <div className="flex-1">
                        <h5 className={`text-base font-bold ${
                          solution.name === 'ShipItSmart' ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {solution.name}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {solution.name === 'ShipItSmart' ? solution.title : 'Coming Soon'}
                        </p>
                      </div>
                      {solution.name === 'ShipItSmart' && (
                        <div className="text-xs bg-accent text-accent-foreground px-3 py-1 rounded ml-3">
                          Login
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
