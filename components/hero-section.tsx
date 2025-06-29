"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// Slideshow data with synchronized content
const slides = [
  {
    background: "bg-[url('/images/hero-variation-1/hero-2.png')] bg-cover bg-center bg-no-repeat",
    title: "Ship smart with",
    titleAccent: "ShipItSmart.",
    subtitle: "Global shipping",
    subtitleAccent: "simplified.",
    description: "Smart shipping solutions.",
    textColor: "text-white"
  },
  {
    background: "bg-[url('/images/hero-variation-1/hero-3.png')] bg-cover bg-center bg-no-repeat",
    title: "Smarter",
    titleAccent: "Freight.",
    subtitle: "Smoother",
    subtitleAccent: "Journeys.",
    description: "Experience a new level of transparency, speed, and service in global logistics.",
    textColor: "text-white"
  },
  {
    background: "bg-[url('/images/hero-variation-1/hero-4.png')] bg-cover bg-center bg-no-repeat",
    title: "Smart",
    titleAccent: "Returns.",
    subtitle: "Seamless",
    subtitleAccent: "Experience.",
    description: "Make returns hassle-free for customers — and efficient, trackable, and cost-effective for you.",
    textColor: "text-white"
  },
  {
    background: "bg-[url('/images/hero-variation-1/hero-5.png')] bg-cover bg-center bg-no-repeat",
    title: "Smart Fulfilment",
    titleAccent: "for Growing",
    subtitle: "Brands",
    subtitleAccent: "that scale.",
    description: "Seamless storage, picking, packing, and shipping — built to scale with your business.",
    textColor: "text-white"
  }
]

export default function HeroSection() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [titleAnimation, setTitleAnimation] = useState("animate-in")

  // Main slide timer - changes slide every 6 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      // Trigger fade out animation
      setTitleAnimation("animate-out")
      
      // After animation, change slide and trigger fade in
      setTimeout(() => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length)
        setTitleAnimation("animate-in")
      }, 300)
    }, 18000)

    return () => clearInterval(slideTimer)
  }, [])

  // Manual slide navigation
  const goToSlide = (index: number) => {
    setTitleAnimation("animate-out")
        setTimeout(() => {
      setCurrentSlideIndex(index)
      setTitleAnimation("animate-in")
    }, 300)
      }

  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow backgrounds */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlideIndex ? 'opacity-100' : 'opacity-0'
          } ${slide.background}`}
        />
      ))}
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-[#14529f]/10 z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex items-center h-full">
        <div className="flex flex-col items-start text-left space-y-6 max-w-2xl">
          {/* Main title with animations */}
          <h1 className={`text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${slides[currentSlideIndex].textColor} transition-all duration-500 ease-in-out ${
            titleAnimation === "animate-in" 
              ? "opacity-100 translate-y-0 transform" 
              : "opacity-0 translate-y-4 transform"
          }`}>
            {slides[currentSlideIndex].title} <span className="text-white">{slides[currentSlideIndex].titleAccent}</span><br />
            {slides[currentSlideIndex].subtitle} <span className="text-white">{slides[currentSlideIndex].subtitleAccent}</span>
          </h1>

          {/* Description text */}
          <div className={`transition-all duration-500 ease-in-out ${
            titleAnimation === "animate-in" 
              ? "opacity-100 translate-y-0 transform" 
              : "opacity-0 translate-y-4 transform"
          }`}>
            <p className="text-base sm:text-lg md:text-xl font-medium text-white">
              {slides[currentSlideIndex].description}
            </p>
          </div>

          {/* CTA Button */}
          <div className={`pt-4 transition-all duration-500 ease-in-out ${
            titleAnimation === "animate-in" 
              ? "opacity-100 translate-y-0 transform" 
              : "opacity-0 translate-y-4 transform"
          }`}>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Get Started →
            </Button>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlideIndex
                ? 'bg-accent scale-125'
                : 'bg-primary/50 hover:bg-primary/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
