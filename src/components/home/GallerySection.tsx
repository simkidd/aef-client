"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Camera,
} from "lucide-react";

import { GalleryPhotoItem } from "@/interfaces";

export interface GalleryPhoto {
  id: number | string;
  src: string;
  title: string;
  location: string;
  date: string;
  category: string;
  aspectClass: string;
  description: string;
}

// Curated authentic photographs matching GalleryViewer design system
const homeGalleryPhotos: GalleryPhoto[] = [
  {
    id: 1,
    src: "/images/auth-hero-network.jpg",
    title: "Network Infrastructure & Server Rack Laboratory",
    location: "Victoria Island Hub, Lagos",
    date: "Cohort 2025",
    category: "Cloud Engineering",
    aspectClass: "aspect-[16/11]",
    description:
      "Trainees assembling high-density Cat6 patch panels, configuring managed Cisco switches, and implementing enterprise rack cabling architecture.",
  },
  {
    id: 2,
    src: "/images/auth-hero-solar.jpg",
    title: "Hybrid Inverter Synchronization & Battery Bank Storage",
    location: "Ikeja Renewable Energy Lab",
    date: "Cohort 2025",
    category: "Clean Energy",
    aspectClass: "aspect-[3/4]",
    description:
      "Hands-on diagnostics on lithium iron phosphate (LiFePO4) solar storage banks and pure sine wave off-grid inverter commissioning.",
  },
  {
    id: 3,
    src: "/images/gallery-welding.jpg",
    title: "Precision Metal & Heavy Steel Fabrication",
    location: "Port Harcourt Heavy Trades Hub",
    date: "Cohort 2025",
    category: "Technical Trades",
    aspectClass: "aspect-[4/3]",
    description:
      "Students mastering industrial arc welding, TIG joints, and structural steel assembly adhering to heavy-industry safety standards.",
  },
  {
    id: 4,
    src: "/images/gallery-agri.jpg",
    title: "Agritech Greenhouse Climate & Hydroponic Systems",
    location: "Rivers Agribusiness Hub",
    date: "Cohort 2025",
    category: "Agribusiness",
    aspectClass: "aspect-[3/4]",
    description:
      "Soilless vegetable propagation, nutrient balance titration, and automated drip irrigation monitoring within our climate-controlled demonstration greenhouse.",
  },
  {
    id: 5,
    src: "/images/auth-hero-social.jpg",
    title: "Advanced Garment Construction & Industrial Pattern Drafting",
    location: "Surulere Creative Hub",
    date: "Cohort 2024",
    category: "Fashion Design",
    aspectClass: "aspect-square",
    description:
      "Students mastering computer-aided flat pattern alterations, precision tailoring techniques, and industrial overlock stitch mastery.",
  },
  {
    id: 6,
    src: "/images/auth-hero-makeup.jpg",
    title: "Fellowship Graduation & Professional Portfolio Day",
    location: "Main Auditorium, Lagos",
    date: "Cohort 2024",
    category: "Creative Arts",
    aspectClass: "aspect-[4/5]",
    description:
      "Vocational apprenticeship workshop in specialized cosmetic arts, aesthetics, and entrepreneurship.",
  },
];

interface GallerySectionProps {
  featuredPhotos?: GalleryPhotoItem[];
}

export default function GallerySection({ featuredPhotos }: GallerySectionProps = {}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const displayPhotos: GalleryPhoto[] =
    featuredPhotos && featuredPhotos.length > 0
      ? featuredPhotos.map((p, idx) => ({
          id: p._id || p.id || idx,
          src: p.imageUrl || p.src || homeGalleryPhotos[idx % homeGalleryPhotos.length].src,
          title: p.title || "Hands-on Vocational Training",
          location: p.location || "Regional Training Hub",
          date: p.date || "Cohort 2026",
          category: p.category || "Vocational Trade",
          aspectClass: homeGalleryPhotos[idx % homeGalleryPhotos.length].aspectClass,
          description: p.description || p.title || "Adele Foundation empowerment session.",
        }))
      : homeGalleryPhotos;

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSelectedIndex((prev) =>
        prev === null ? null : (prev - 1 + displayPhotos.length) % displayPhotos.length
      );
    },
    [displayPhotos.length]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % displayPhotos.length));
    },
    [displayPhotos.length]
  );

  // Keyboard navigation for exhibition lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (selectedIndex === null || !thumbnailStripRef.current) return;
    const activeThumb = thumbnailStripRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedIndex]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  const selectedPhoto = selectedIndex !== null ? displayPhotos[selectedIndex] : null;

  return (
    <section id="gallery" className="py-20 md:py-28 bg-background border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Camera className="h-3.5 w-3.5" />
            <span>Our Impact in Action</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
            Real Moments From Our Programs
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            A glimpse into the lives we are transforming through practical skills training, community engagement, and dedicated mentorship.
          </p>
        </div>

        {/* Waterfall Masonry Columns (Matching Gallery Page Design) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {displayPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedIndex(index)}
              className="break-inside-avoid group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-border/80 dark:border-white/10 shadow-sm hover:shadow-2xl hover:border-primary/60 transition-all duration-300 cursor-pointer"
            >
              {/* Image Container with Natural Aspect Ratio */}
              <div className={`relative w-full ${photo.aspectClass} overflow-hidden bg-slate-900`}>
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 2}
                />

                {/* Gradient Vignette Overlay (Visible on Hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Category Badge (Reveals on Hover) */}
                <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    {photo.category}
                  </span>
                </div>

                {/* Bottom Photo Caption (Slides up smoothly on hover) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2 text-[10px] text-emerald-300 font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      <span>{photo.location}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-white/80">
                      <Calendar className="h-2.5 w-2.5" />
                      <span>{photo.date}</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-sm sm:text-base text-white leading-snug line-clamp-2 drop-shadow-md">
                    {photo.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button: Explore Full Gallery */}
        <div className="mt-14 text-center">
          <Link href="/gallery">
            <button
              type="button"
              className="h-12 px-8 rounded-full font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 hover:scale-105 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Explore Full Photo Gallery</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* FULL-SCREEN Exhibition Lightbox Modal (Matching Gallery Page Design) */}
      {selectedPhoto !== null && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-black/98 text-white overflow-hidden select-none animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Header Bar */}
          <header
            className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-white/10 bg-black/70 backdrop-blur-md z-30 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate font-heading">
                {selectedPhoto.title}
              </h2>
              <p className="text-[11px] text-white/60 truncate flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <MapPin className="h-3 w-3" />
                  <span>{selectedPhoto.location}</span>
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1 text-white/70">
                  <Calendar className="h-3 w-3" />
                  <span>{selectedPhoto.date}</span>
                </span>
                <span>&bull;</span>
                <span className="uppercase text-[10px] text-emerald-400 font-bold">
                  {selectedPhoto.category}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-white/50 mr-2">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[10px]">
                  ←
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[10px]">
                  →
                </kbd>
                <span>Navigate</span>
              </span>

              <span className="text-xs text-white/60 font-medium mr-2">
                {selectedIndex + 1} of {displayPhotos.length}
              </span>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Photo Stage */}
          <main
            className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-8 z-30 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>

            {/* Photo Container */}
            <div className="relative w-full h-full flex items-center justify-center max-w-5xl">
              <Image
                key={selectedPhoto.id}
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                className="object-contain animate-in fade-in zoom-in-95 duration-200"
                priority
                sizes="100vw"
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-8 z-30 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
              aria-label="Next photograph"
            >
              <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>
          </main>

          {/* Bottom Full-Width Bar with Centered Thumbnails (Matching GalleryViewer) */}
          <footer
            className="shrink-0 bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 sm:py-4 z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-2.5">
              {/* Photo Description text */}
              <p className="text-xs text-white/70 text-center max-w-3xl line-clamp-1 hidden sm:block">
                {selectedPhoto.description}
              </p>

              {/* Centered Scrollable Thumbnail Row */}
              <div
                ref={thumbnailStripRef}
                className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar w-full max-w-full px-2 py-1"
              >
                {displayPhotos.map((photo, i) => (
                  <button
                    key={photo.id}
                    data-index={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                      i === selectedIndex
                        ? "ring-2 ring-emerald-400 scale-105 opacity-100 shadow-lg shadow-emerald-500/25"
                        : "opacity-40 hover:opacity-85 hover:scale-100"
                    }`}
                    aria-label={`View photograph ${i + 1}`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </footer>
        </div>
      )}
    </section>
  );
}
