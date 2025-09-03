"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"

// Slideshow data with synchronized content
const slides = [
  {
    background: "bg-[url('/images/hero-variation-smart/smart-shipit.png')] bg-cover bg-top bg-no-repeat",
    title: "Ship smart with",
    titleAccent: "ShipItSmart.",
    subtitle: "Global shipping",
    subtitleAccent: "simplified.",
    description: "Smart shipping solutions.",
    textColor: "text-white",
    label: "Shipping"
  },
  {
    background: "bg-[url('/images/hero-variation-smart/smart-frieght.png')] bg-cover bg-top bg-no-repeat",
    title: "Smarter",
    titleAccent: "Freight.",
    subtitle: "Faster",
    subtitleAccent: "Deliveries.",
    description: "Transparent, fast global logistics.",
    textColor: "text-white",
    label: "Freight"
  },
  {
    background: "bg-[url('/images/hero-variation-smart/smart-returnit.png')] bg-cover bg-top bg-no-repeat",
    title: "Smart",
    titleAccent: "Returns.",
    subtitle: "Hassle-free",
    subtitleAccent: "Process.",
    description: "Efficient, trackable returns.",
    textColor: "text-white",
    label: "Returns"
  },
  {
    background: "bg-[url('/images/hero-variation-smart/smart-fufillit.png')] bg-cover bg-top bg-no-repeat",
    title: "Smart Fulfilment",
    titleAccent: "for Growing",
    subtitle: "E-Commerce",
    subtitleAccent: "Brands.",
    description: "Storage, picking, packing, shipping.",
    textColor: "text-white",
    label: "Fulfillment"
  }
]

const SLIDE_DURATION = 15000 // 15 seconds

export default function HeroSection() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [titleAnimation, setTitleAnimation] = useState("animate-in")
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // Function to start the slide timer
  const startSlideTimer = () => {
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current)
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
    
    startTimeRef.current = Date.now()
    setProgress(0)
    
    // Start progress animation
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      const progressPercent = Math.min((elapsed / SLIDE_DURATION) * 100, 100)
      setProgress(progressPercent)
      
      if (progressPercent < 100 && !isPaused) {
        progressTimerRef.current = setTimeout(updateProgress, 16) // ~60fps
      }
    }
    updateProgress()
    
    // Set slide change timer
    slideTimerRef.current = setTimeout(() => {
      if (!isPaused) {
        nextSlide()
      }
    }, SLIDE_DURATION)
  }

  // Function to go to next slide
  const nextSlide = () => {
    setTitleAnimation("animate-out")
    setTimeout(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length)
      setTitleAnimation("animate-in")
      startSlideTimer()
    }, 300)
  }

  // Manual slide navigation
  const goToSlide = (index: number) => {
    if (index === currentSlideIndex) return
    
    setTitleAnimation("animate-out")
    setTimeout(() => {
      setCurrentSlideIndex(index)
      setTitleAnimation("animate-in")
      startSlideTimer()
    }, 300)
  }

  // Pause/resume functionality
  const handlePause = () => {
    setIsPaused(true)
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current)
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
  }

  const handleResume = () => {
    setIsPaused(false)
    const elapsed = Date.now() - startTimeRef.current
    const remaining = SLIDE_DURATION - elapsed
    
    if (remaining > 0) {
      // Resume from where we left off
      const updateProgress = () => {
        const totalElapsed = Date.now() - startTimeRef.current
        const progressPercent = Math.min((totalElapsed / SLIDE_DURATION) * 100, 100)
        setProgress(progressPercent)
        
        if (progressPercent < 100 && !isPaused) {
          progressTimerRef.current = setTimeout(updateProgress, 16)
        }
      }
      updateProgress()
      
      slideTimerRef.current = setTimeout(nextSlide, remaining)
    } else {
      nextSlide()
    }
  }

  // Initialize timer on mount
  useEffect(() => {
    startSlideTimer()
    
    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current)
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current)
    }
  }, [])

  // Handle pause state changes
  useEffect(() => {
    if (isPaused) {
      handlePause()
    } else {
      handleResume()
    }
  }, [isPaused])

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
      
      {/* Dark overlay for improved text contrast */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex items-center h-full">
        <div className="flex flex-col items-start text-left space-y-6 max-w-2xl">
          {/* Main title with animations */}
          <h1 className={`text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight ${slides[currentSlideIndex].textColor} transition-all duration-500 ease-in-out ${
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

      {/* Enhanced slide indicators with progress and labels */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slide indicators with labels */}
        <div className="flex items-center justify-center space-x-6">
          {slides.map((slide, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              {/* Circular progress indicator */}
              <button
                onClick={() => goToSlide(index)}
                className="relative group"
                aria-label={`Go to ${slide.label} slide`}
              >
                {/* Outer progress ring */}
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  {/* Progress circle - only show for current slide */}
                  {index === currentSlideIndex && (
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="100"
                      strokeDashoffset={100 - progress}
                      className="transition-all duration-75 ease-linear"
                    />
                  )}
                </svg>
                
                {/* Inner dot */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  index === currentSlideIndex
                    ? 'scale-110'
                    : 'group-hover:scale-105'
                }`}>
                  <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlideIndex
                      ? 'bg-accent shadow-lg shadow-accent/30'
                      : 'bg-white/60 group-hover:bg-white/80'
                  }`} />
                </div>
              </button>
              
              {/* Slide label */}
              <span className={`text-xs font-medium transition-all duration-300 ${
                index === currentSlideIndex
                  ? 'text-accent font-semibold'
                  : 'text-white/70'
              }`}>
                {slide.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
