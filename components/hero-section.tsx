"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

const dynamicSubheadings = ["Precision logistics worldwide.", "Your cargo, delivered.", "Global reach, local care."]

export default function HeroSection() {
  const [currentSubheadingIndex, setCurrentSubheadingIndex] = useState(0)
  const [displayedSubheading, setDisplayedSubheading] = useState("")
  const [isTypingSubheading, setIsTypingSubheading] = useState(true)

  // Typewriter effect for subheadings (slowed down)
  useEffect(() => {
    const currentText = dynamicSubheadings[currentSubheadingIndex]
    let currentIndex = 0
    setDisplayedSubheading("")
    setIsTypingSubheading(true)

    const typeInterval = setInterval(() => {
      if (currentIndex < currentText.length) {
        setDisplayedSubheading(currentText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTypingSubheading(false)
        clearInterval(typeInterval)

        // Wait 3 seconds before starting to type the next text
        setTimeout(() => {
          setCurrentSubheadingIndex((prevIndex) => (prevIndex + 1) % dynamicSubheadings.length)
        }, 3000)
      }
    }, 120) // Slowed down from 80ms to 120ms

    return () => clearInterval(typeInterval)
  }, [currentSubheadingIndex])

  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background video - full screen */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        poster="/abstract-blue-ocean-waves.png"
      >
        <source src="/videos/hero-background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex items-center justify-between h-full">
        <div className="flex flex-col items-start text-left space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight whitespace-nowrap">
            We don't just move <span className="text-foreground">things.</span><br />
            We move <span className="text-accent">industries.</span>
          </h1>

          {/* Typewriter effect container for subheading */}
          <div className="h-12 flex items-center">
            <p className="text-xl sm:text-2xl text-zinc-200 font-medium">
              {displayedSubheading}
              {isTypingSubheading && <span className="inline-block w-0.5 h-6 bg-accent ml-1 animate-pulse" />}
            </p>
          </div>

          <div className="pt-2">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
            >
              Get Started →
            </Button>
          </div>
        </div>

        {/* Three square placeholder elements for animations - right side */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8 h-full">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300">
            <div className="w-8 h-8 bg-accent/50 rounded-sm animate-pulse"></div>
          </div>
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300">
            <div className="w-8 h-8 bg-accent/50 rounded-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300">
            <div className="w-8 h-8 bg-accent/50 rounded-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  )
}
