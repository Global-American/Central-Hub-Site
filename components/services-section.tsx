"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { brands } from "@/lib/brands"

// Shipping and freight can be priced straight away on the quote page;
// returns and fulfillment start with a conversation
const QUOTABLE = new Set([1, 2])

const anchorFor = (name: string) => name.toLowerCase().replace(/\s+/g, "-")
const stepNumber = (index: number) => String(index + 1).padStart(2, "0")

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-md border-2 border-[#1F447B] bg-[#EB993C] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#d4822a] hover:shadow-lg"
const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-md border-2 border-[#1F447B] bg-white px-6 py-3 font-semibold text-[#1F447B] transition-colors hover:border-[#EB993C] hover:text-[#EB993C]"

/** Fades its children up once they scroll into view */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Anything already on screen at load shows straight away
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section id="services" className="pt-28 pb-16 md:pt-32 md:pb-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
            Our Services
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-[#1F447B]">Smart Logistics</span>{" "}
            <span className="text-[#EB993C]">Solutions</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#324A6D]/70">
            Four dedicated platforms covering shipping, freight, returns and
            fulfillment, built to power your business growth. Here&apos;s what
            each one does and who it&apos;s for.
          </p>
        </Reveal>

        {/* One section per service, artwork alternating sides from lg up */}
        <div className="mt-10 md:mt-14">
          {brands.map((brand, index) => (
            <section
              key={brand.id}
              id={anchorFor(brand.name)}
              aria-labelledby={`${anchorFor(brand.name)}-title`}
              className="border-t border-[#1F447B] py-12 md:py-16"
            >
              {/* Artwork comes first so it leads on phones; from lg up it
                  moves to the right on every other section */}
              <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div
                  className={`relative aspect-[4/3] w-full ${
                    index % 2 === 0 ? "lg:order-last" : ""
                  }`}
                >
                  <Image
                    src={brand.image}
                    alt={`${brand.name} illustration`}
                    fill
                    sizes="(min-width: 1024px) 540px, 100vw"
                    className="object-contain"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EB993C]">
                    {stepNumber(index)} · {brand.label}
                  </p>
                  <Image
                    src={brand.logoColor}
                    alt={brand.name}
                    width={1480}
                    height={390}
                    sizes="240px"
                    className="mt-4 h-9 md:h-10 w-auto object-contain object-left"
                  />
                  <h2
                    id={`${anchorFor(brand.name)}-title`}
                    className="mt-5 text-2xl md:text-3xl font-bold leading-tight text-[#1F447B]"
                  >
                    {brand.headline}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[#324A6D]/80">
                    {brand.description}
                  </p>

                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {brand.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-snug text-[#324A6D]"
                      >
                        <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EB993C] text-white">
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 border-l-4 border-[#EB993C] pl-4 text-sm text-[#324A6D]">
                    <span className="font-semibold text-[#1F447B]">Best for:</span>{" "}
                    {brand.bestFor}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    {QUOTABLE.has(brand.id) ? (
                      <Link href="/quote" className={primaryButtonClass}>
                        Get a Quote
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    ) : (
                      <Link href="/contact" className={primaryButtonClass}>
                        Talk to Us
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    )}
                    <a
                      href={brand.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={secondaryButtonClass}
                    >
                      Visit {brand.name}
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                  </div>
                </div>
              </Reveal>
            </section>
          ))}
        </div>

        {/* Closing prompt */}
        <Reveal className="border-t border-[#1F447B] pt-12 md:pt-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                <span className="text-[#1F447B]">Not sure which service</span>{" "}
                <span className="text-[#EB993C]">you need?</span>
              </h2>
              <p className="mt-3 leading-relaxed text-[#324A6D]/70">
                Tell us what you&apos;re moving and we&apos;ll help you find
                the right fit, or combine them.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className={primaryButtonClass}>
                Get a Quote
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/contact" className={secondaryButtonClass}>
                Contact Us
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
