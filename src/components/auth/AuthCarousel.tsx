"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Network, Megaphone, SunMedium, Sparkles } from "lucide-react";

interface Slide {
  id: string;
  image: string;
  alt: string;
  tag: string;
  icon: React.ElementType;
  headline: string;
  quote: string;
  author: string;
  role: string;
}

const slides: Slide[] = [
  {
    id: "network",
    image: "/images/auth-hero-network.jpg",
    alt: "Adele Foundation Network System Installation technical training workshop",
    tag: "Network System Installation",
    icon: Network,
    headline: "Empowering technicians to connect communities.",
    quote:
      "Practical routing and structured cabling gave me the confidence to install enterprise networks.",
    author: "Moses Kalu",
    role: "Network Engineering Fellow",
  },
  {
    id: "social-media",
    image: "/images/auth-hero-tech.jpg",
    alt: "Adele Foundation Social Media Communications and digital media lab",
    tag: "Social Media Communications",
    icon: Megaphone,
    headline: "Amplifying community voices and digital reach.",
    quote:
      "Learned brand storytelling and digital campaign management that scaled local businesses.",
    author: "Blessing Okoro",
    role: "Communications Fellow",
  },
  {
    id: "solar-pv",
    image: "/images/skill-solar-pv.jpg",
    alt: "Adele Foundation Solar PV Installation & Maintenance workshop",
    tag: "Solar PV Installation & Maintenance",
    icon: SunMedium,
    headline: "Clean energy solutions powering local industry.",
    quote:
      "Mastered solar panel array sizing, inverter setups, and electrical safety standards.",
    author: "Amina Bello",
    role: "Solar PV Fellow",
  },
  {
    id: "beauty-cosmetology",
    image: "/images/auth-hero-fashion.jpg",
    alt: "Adele Foundation Beauty Therapy & Cosmetology professional studio",
    tag: "Beauty Therapy & Cosmetology",
    icon: Sparkles,
    headline: "Mastering aesthetic craft and salon enterprise.",
    quote:
      "Gained professional skincare and cosmetology skills to launch my own beauty studio.",
    author: "Grace Adeyemi",
    role: "Cosmetology Fellow",
  },
];

export function AuthCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = slides[current];

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between p-8 sm:p-10 xl:p-14 overflow-hidden group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Full-Bleed Background Images with Smooth Cross-Fade */}
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 pointer-events-none select-none touch-none transition-opacity duration-1000 ease-in-out ${
            idx === current
              ? "opacity-100 z-0 scale-100"
              : "opacity-0 -z-10 scale-105"
          }`}
          style={{
            transitionProperty: "opacity, transform",
            transitionDuration: "1000ms",
          }}
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 42vw"
            quality={80}
            priority={idx <= 1}
            draggable={false}
            className="object-cover object-center pointer-events-none select-none touch-none"
          />
        </div>
      ))}

      {/* 2. Editorial Gradient Overlays for Readability & Blended Depth */}
      <div className="absolute inset-0 z-1 bg-linear-to-t from-slate-950 via-slate-950/70 to-slate-950/35 pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-[#064E3B]/40 mix-blend-multiply pointer-events-none" />
      <div className="absolute -top-32 -left-32 z-1 w-96 h-96 rounded-full bg-emerald-500/20 blur-[130px] pointer-events-none" />

      {/* 3. Top Foundation Identity */}
      <div className="relative z-10">
        <Link
          href="/"
          title="Return to Foundation Home"
          className="inline-flex items-center gap-3.5 group/logo"
        >
          <div className="p-2 rounded-2xl bg-white shadow-lg group-hover/logo:scale-105 transition-transform">
            <Image
              src="/logos/adele-logo.png"
              alt="Adele Empowerment Foundation"
              width={38}
              height={38}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-tight text-white block drop-shadow-xs">
              ADELE EMPOWERMENT FOUNDATION
            </span>
            <span className="text-[11px] font-medium text-emerald-300 tracking-wide block drop-shadow-xs">
              Skills Training & Community Development
            </span>
          </div>
        </Link>
      </div>

      {/* 4. Bottom Storytelling (Anchored at the bottom) */}
      <div className="relative z-10 mt-auto pt-10 space-y-4 max-w-2xl">
        {/* Minimal High-Impact Headline (Only the headline animates on slide change) */}
        <div
          key={slide.id}
          className="transition-all duration-700 animate-in fade-in slide-in-from-bottom-3"
        >
          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            {slide.headline}
          </h2>
        </div>

        {/* Subtle Track Indicator & Clickable Pagination (Stationary) */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-medium text-emerald-300/80">
          <span>{slide.tag}</span>

          {/* Clickable Pagination Indicators */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}: ${s.tag}`}
                title={s.tag}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current
                    ? "w-7 bg-emerald-400 shadow-xs shadow-emerald-400/50"
                    : "w-1.5 bg-white/30 hover:bg-white/60 hover:scale-125"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthCarousel;
