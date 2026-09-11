import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const slides = [
  {
    tag: 'New Collection',
    title: 'Find Your Style,',
    subtitleLine2: 'Love Your Look ✨',
    description: 'Discover the latest trends in fashion, beauty, and lifestyle crafted for your everyday elegance.',
    buttonText: 'Shop Now',
    route: '/products?category=fashion',
    gradient: 'from-[#8B5CF6] via-[#A855F7] to-[#EC4899]',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80',
    badge: 'Trending 2026'
  },
  {
    tag: 'Summer Essentials',
    title: 'Breezy Silhouettes,',
    subtitleLine2: 'Effortless Chic ☀️',
    description: 'Lightweight linen, vibrant pastels, and statement accessories curated for golden days.',
    buttonText: 'Explore Summer',
    route: '/deals',
    gradient: 'from-[#7C3AED] via-[#9333EA] to-[#F43F5E]',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=80',
    badge: 'Up to 50% Off'
  },
  {
    tag: 'Tech Meets Luxury',
    title: 'Smart Wearables,',
    subtitleLine2: 'Unrivaled Audio 🎧',
    description: 'Elevate your daily rhythm with intelligent devices and acoustic perfection.',
    buttonText: 'Discover Tech',
    route: '/products?category=electronics',
    gradient: 'from-[#6366F1] via-[#8B5CF6] to-[#D946EF]',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&auto=format&fit=crop&q=80',
    badge: 'Premium Picks'
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = slides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full rounded-3xl overflow-hidden shadow-xl shadow-purple-900/10 text-white min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex items-center transition-all duration-500"
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-all duration-700`}
      />

      {/* Subtle organic light orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full px-6 sm:px-10 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Text */}
        <div className="w-full md:w-3/5 space-y-4 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{slide.tag}</span>
            <span className="opacity-60">•</span>
            <span className="text-amber-200">{slide.badge}</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {slide.title}
              <br />
              <span className="text-amber-200 drop-shadow-sm">
                {slide.subtitleLine2}
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-purple-100 max-w-md leading-relaxed font-normal">
            {slide.description}
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => navigate(slide.route)}
              type="button"
              className="px-6 py-3 bg-white text-purple-900 hover:bg-purple-50 rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-200 flex items-center gap-2 group/btn cursor-pointer"
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-4 h-4 text-purple-700 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Model/Product Image */}
        <div className="w-full md:w-2/5 flex justify-center md:justify-end relative">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-76 lg:h-76 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 transform md:rotate-1 hover:rotate-0 transition-transform duration-500">
            <img
              src={slide.image}
              alt="NovaShop Collection"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Prev / Next slide navigation arrows */}
      <button
        onClick={handlePrev}
        type="button"
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        type="button"
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Carousel Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === idx
                ? 'w-7 h-2 bg-white shadow-sm'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
