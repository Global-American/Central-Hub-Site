"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Volume2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function VideoSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-28 lg:py-36 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 lg:mb-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Badge variant="outline" className="text-xs border-accent text-accent bg-accent/10 mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Logistics intelligence <span className="text-accent">in action</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience how our smart logistics platforms work together to streamline your supply chain operations and accelerate your business growth.
          </p>
        </div>

        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <div
            className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Video Container */}
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
              {/* Placeholder for Video - Will be replaced when video is available */}
              <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                <div className="text-center text-white/80">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <Play className="h-8 w-8 ml-1" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Logistics in Action</h3>
                  <p className="text-sm opacity-80">Demo video coming soon</p>
                </div>
              </div>

              {/* Video Overlay with Controls */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group hover:bg-black/10 transition-colors duration-300">
                <Button
                  disabled
                  size="lg"
                  className="bg-white/90 hover:bg-white text-primary shadow-xl rounded-full w-16 h-16 sm:w-20 sm:h-20 opacity-50 cursor-not-allowed"
                >
                  <Play className="h-6 w-6 sm:h-8 sm:w-8 ml-0.5 sm:ml-1" />
                </Button>
              </div>


            </div>
          </div>


        </div>
      </div>
    </section>
  )
} 