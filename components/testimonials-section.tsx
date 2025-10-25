"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    id: 1,
    text: "Ship It Smart has revolutionized our shipping process. The platform is incredibly intuitive and the cost savings are substantial. We've reduced our shipping costs by 30% while improving delivery times.",
    name: "Sarah Johnson",
    title: "Operations Director",
    company: "TechFlow Solutions",
    rating: 5,
  },
  {
    id: 2,
    text: "The integration with our e-commerce platform was seamless. Customer support is outstanding and the real-time tracking keeps our customers happy. Highly recommend for any growing business.",
    name: "Michael Chen",
    title: "Founder & CEO",
    company: "Urban Essentials",
    rating: 5,
  },
  {
    id: 3,
    text: "We've been using Ship It Smart for over a year now and couldn't be happier. The carrier network is extensive and the analytics help us make better shipping decisions every day.",
    name: "Emma Rodriguez",
    title: "Logistics Manager",
    company: "Craft & Co.",
    rating: 5,
  },
  {
    id: 4,
    text: "The bulk shipping features have been a game-changer for our business. Processing hundreds of orders daily is now effortless, and the cost savings speak for themselves.",
    name: "David Thompson",
    title: "Supply Chain Director",
    company: "Global Traders Inc.",
    rating: 5,
  },
  {
    id: 5,
    text: "Amazing platform! The API integration was straightforward and their developer support team helped us get up and running in just a few days. Our shipping workflow is now completely automated.",
    name: "Lisa Park",
    title: "CTO",
    company: "InnovateTech",
    rating: 5,
  },
  {
    id: 6,
    text: "The international shipping capabilities have opened up new markets for us. Customs documentation is handled automatically and delivery times are consistently reliable.",
    name: "James Wilson",
    title: "Export Manager",
    company: "WorldWide Goods",
    rating: 5,
  },
  {
    id: 7,
    text: "Switching to Ship It Smart was one of our best business decisions. The user interface is clean, the pricing is transparent, and the support team is always available when we need them.",
    name: "Rachel Martinez",
    title: "Business Owner",
    company: "Artisan Marketplace",
    rating: 5,
  },
  {
    id: 8,
    text: "The real-time rate comparison feature saves us time and money on every shipment. We can quickly choose the best carrier option for each package based on our specific needs.",
    name: "Alex Kumar",
    title: "Fulfillment Manager",
    company: "QuickShip Pro",
    rating: 5,
  },
  {
    id: 9,
    text: "Outstanding service! The platform handles our peak season volume without any issues. The scalability and reliability have been crucial for our growing e-commerce business.",
    name: "Jennifer Lee",
    title: "VP of Operations",
    company: "Fashion Forward",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalPages]);

  const sectionRef = useRef<HTMLElement>(null);

  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true,
    })
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-[#EB993C]" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getAllSlides = () => {
    const slides = [];
    for (let i = 0; i < totalPages; i++) {
      const startIndex = i * testimonialsPerPage;
      slides.push(
        testimonials.slice(startIndex, startIndex + testimonialsPerPage)
      );
    }
    return slides;
  };

  return (
    <section className="bg-[#f6fdfe] from-gray-50 to-gray-100 py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-[#1F447B] rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#EB993C] rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-[#1F447B] rounded-lg transform rotate-45"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 border-2 border-[#EB993C] rounded-lg transform rotate-12"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 lg:mb-20`}>
          <Badge
            variant="outline"
            className="text-xs border-accent text-accent bg-accent/10 mb-4"
          >
            Customer Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-accent">Clients Say</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Hear from the businesses that trust
            Global American to power their logistics operations worldwide.
          </p>
        </div>
        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[#1F447B]">
          {/* Testimonials Grid */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 w-14 h-14 bg-gradient-to-r from-[#1F447B] to-[#324A6D] shadow-xl rounded-full flex items-center justify-center text-white hover:from-[#EB993C] hover:to-[#d97706] hover:shadow-2xl transition-all duration-300 z-10 group"
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 w-14 h-14 bg-gradient-to-r from-[#1F447B] to-[#324A6D] shadow-xl rounded-full flex items-center justify-center text-white hover:from-[#EB993C] hover:to-[#d97706] hover:shadow-2xl transition-all duration-300 z-10 group"
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Testimonials Container with Smooth Sliding Animation */}
            <div className="overflow-hidden rounded-2xl border-[#1F447B]">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {getAllSlides().map((slideTestimonials, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {slideTestimonials.map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className="bg-[#f6fdfe] rounded-2xl shadow-lg p-8 hover:shadow-xl border border-[#1F447B] relative group"
                        >
                          {/* Quote Icon */}
                          <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                            <svg
                              className="w-8 h-8 text-[#EB993C]"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                            </svg>
                          </div>

                          {/* Stars */}
                          <div className="flex mb-6">
                            {renderStars(testimonial.rating)}
                          </div>

                          {/* Quote */}
                          <blockquote className="text-[#324A6D] leading-relaxed mb-8 text-base font-medium">
                            "{testimonial.text}"
                          </blockquote>

                          {/* Author Info */}
                          <div className="border-t border-[#1F447B] pt-6">
                            <h4 className="font-bold text-[#1F447B] text-lg mb-1">
                              {testimonial.name}
                            </h4>
                            <p className="text-[#324A6D] text-sm mb-1">
                              {testimonial.title}
                            </p>
                            <p className="text-[#EB993C] font-semibold text-sm">
                              {testimonial.company}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-12 space-x-3">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#EB993C] w-10 h-4"
                      : "bg-[#1F447B] hover:bg-[#6f85a6] w-4 h-4"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-[#1F447B] hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl font-bold text-[#EB993C] mb-3">4.9/5</div>
            <p className="text-[#324A6D] font-semibold text-lg mb-3">
              Average Rating
            </p>
            <div className="flex justify-center">{renderStars(5)}</div>
          </div>

          <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-[#1F447B] hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl font-bold text-[#EB993C] mb-3">
              10,000+
            </div>
            <p className="text-[#324A6D] font-semibold text-lg">
              Happy Customers
            </p>
          </div>

          <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-[#1F447B] hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl font-bold text-[#EB993C] mb-3">99.8%</div>
            <p className="text-[#324A6D] font-semibold text-lg">
              Customer Satisfaction
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
