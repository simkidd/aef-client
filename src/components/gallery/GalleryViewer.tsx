"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import {
  X,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryPhotoItem } from "@/interfaces";
import { useGalleryInfiniteQuery } from "@/hooks";

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

export const galleryPhotos: GalleryPhoto[] = [
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
    id: 4,
    src: "/images/auth-hero-network.jpg",
    title: "Electronic Engine Control & Diagnostic Protocol Scans",
    location: "Abuja Mechatronics Workshop",
    date: "Cohort 2025",
    category: "Automotive Tech",
    aspectClass: "aspect-[16/9]",
    description:
      "Fellows analyzing live CAN-bus telemetry, sensor wave patterns, and OBD-II trouble code trees using digital automotive oscilloscopes.",
  },
  {
    id: 5,
    src: "/images/auth-hero-makeup.jpg",
    title: "Fellowship Graduation & Professional Portfolio Day",
    location: "Main Auditorium, Lagos",
    date: "Cohort 2024",
    category: "Milestones",
    aspectClass: "aspect-[4/5]",
    description:
      "A proud graduate completing NIN-verified biometric credential activation, ready to transition into full-time remote tech employment.",
  },
  {
    id: 6,
    src: "/images/auth-hero-solar.jpg",
    title: "Precision Voltage Diagnostics & System Commissioning",
    location: "Port Harcourt Renewable Center",
    date: "Cohort 2025",
    category: "Clean Energy",
    aspectClass: "aspect-[4/3]",
    description:
      "Instructor guiding solar technicians through open-circuit voltage verification, short-circuit current testing, and ground-fault safety compliance.",
  },
  {
    id: 7,
    src: "/images/auth-hero-social.jpg",
    title: "Agritech Greenhouse Climate & Hydroponic Titration",
    location: "Rivers Agribusiness Hub",
    date: "Cohort 2025",
    category: "Agribusiness",
    aspectClass: "aspect-[3/4]",
    description:
      "Soilless vegetable propagation, nutrient balance titration, and automated drip irrigation monitoring within our climate-controlled demonstration greenhouse.",
  },
  {
    id: 8,
    src: "/images/auth-hero-network.jpg",
    title: "Collaborative Software Engineering & Code Review Sprint",
    location: "Lagos Tech Incubator",
    date: "Cohort 2025",
    category: "Software Tech",
    aspectClass: "aspect-[16/10]",
    description:
      "Full-stack developers conducting pair programming, continuous integration testing, and modern React TypeScript application builds.",
  },
  {
    id: 9,
    src: "/images/auth-hero-makeup.jpg",
    title: "Bespoke Fashion Showcase & Artisan Textile Exhibition",
    location: "Victoria Island Cultural Hall",
    date: "Cohort 2024",
    category: "Creative Arts",
    aspectClass: "aspect-[4/5]",
    description:
      "Trainees exhibiting hand-embellished traditional and contemporary garments to local boutique owners and international textile buyers.",
  },
  {
    id: 10,
    src: "/images/auth-hero-network.jpg",
    title: "Digital UI/UX Design & Figma Interactive Prototyping",
    location: "Abuja Training Facility",
    date: "Cohort 2025",
    category: "Design & Media",
    aspectClass: "aspect-[16/9]",
    description:
      "Design participants wireframing cross-platform mobile apps for local agribusiness supply chains and healthcare delivery startups.",
  },
  {
    id: 11,
    src: "/images/hero-student.jpg",
    title: "Masterclass Facilitator Mentorship & Enterprise Advisory",
    location: "Lagos Training Hub",
    date: "Cohort 2025",
    category: "Mentorship",
    aspectClass: "aspect-square",
    description:
      "One-on-one portfolio review and business pitching clinics conducted by senior industry practitioners for prospective fellowship candidates.",
  },
  {
    id: 12,
    src: "/images/auth-hero-solar.jpg",
    title: "Rural Electrification Mini-Grid Commissioning",
    location: "South-South Community Centers",
    date: "Cohort 2024",
    category: "Field Projects",
    aspectClass: "aspect-[16/11]",
    description:
      "Adele Foundation technicians commissioning rooftop solar installations powering rural primary maternity clinics and public schools.",
  },
];


interface GalleryViewerProps {
  initialPhotos?: GalleryPhotoItem[];
}

const fallbackAspects = [
  "aspect-[16/11]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[16/9]",
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[16/10]",
];

export default function GalleryViewer({ initialPhotos }: GalleryViewerProps = {}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAdvancingNext, setIsAdvancingNext] = useState<boolean>(false);

  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // TanStack Query Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGalleryInfiniteQuery({
    limit: 12,
  });

  // Flatten all query pages
  const queryPhotos = useMemo(() => {
    return data?.pages.flatMap((page) => page.photos) || [];
  }, [data]);

  // Unified photo list:
  // 1. If database returned photos, use them.
  // 2. If initialPhotos passed from SSR, use them while query loads.
  // 3. Fallback to static authentic photos.
  const photos: GalleryPhoto[] = useMemo(() => {
    if (queryPhotos.length > 0) {
      return queryPhotos.map((p, index) => ({
        id: p._id || p.id || index + 1,
        src: p.imageUrl || p.src || "/images/auth-hero-social.jpg",
        title: p.title,
        location: p.location || "Adele Training Hub",
        date: p.date || `Cohort ${new Date().getFullYear()}`,
        category: p.category || "General",
        aspectClass:
          p.aspectClass || fallbackAspects[index % fallbackAspects.length],
        description: p.description || "",
      }));
    }

    if (isLoading && initialPhotos && initialPhotos.length > 0) {
      return initialPhotos.map((p, index) => ({
        id: p._id || p.id || index + 1,
        src: p.imageUrl || p.src || "/images/auth-hero-social.jpg",
        title: p.title,
        location: p.location || "Adele Training Hub",
        date: p.date || `Cohort ${new Date().getFullYear()}`,
        category: p.category || "General",
        aspectClass:
          p.aspectClass || fallbackAspects[index % fallbackAspects.length],
        description: p.description || "",
      }));
    }

    return galleryPhotos;
  }, [queryPhotos, initialPhotos, isLoading]);

  const selectedPhoto =
    selectedIndex !== null ? photos[selectedIndex] : null;

  // 1. BACKGROUND PRE-FETCH:
  // When user is viewing near the end of loaded photos (last or second-to-last),
  // automatically pre-fetch the next page in the background!
  useEffect(() => {
    if (
      selectedIndex !== null &&
      selectedIndex >= photos.length - 2 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [selectedIndex, photos.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 2. INFINITE SCROLL SENTINEL FOR THE GRID:
  // Automatically loads more when user scrolls near the bottom of the page
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "350px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 3. NEXT BUTTON HANDLER (Grid & Modal):
  // If user reaches the last photo and clicks Next:
  // - If more photos exist on the server, fetch immediately and advance to the new photo.
  // - If no more exist, stop cleanly without circular disorientation.
  const handleNext = useCallback(async () => {
    if (selectedIndex === null) return;

    // Normal case: next photo already loaded
    if (selectedIndex < photos.length - 1) {
      setSelectedIndex((prev) => (prev === null ? null : prev + 1));
      return;
    }

    // Edge case: User is on the very last photo and clicked Next
    if (hasNextPage && !isFetchingNextPage) {
      setIsAdvancingNext(true);
      try {
        const res = await fetchNextPage();
        const updatedList = res.data?.pages.flatMap((p) => p.photos) || [];
        if (updatedList.length > photos.length) {
          setSelectedIndex(photos.length);
        }
      } finally {
        setIsAdvancingNext(false);
      }
    }
  }, [selectedIndex, photos.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 4. PREVIOUS BUTTON HANDLER:
  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null || prev <= 0) return prev;
      return prev - 1;
    });
  }, []);

  // 5. KEYBOARD NAVIGATION & BODY SCROLL LOCK:
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedIndex, handleNext, handlePrev]);

  // 6. AUTO-SCROLL ACTIVE THUMBNAIL INTO VIEW:
  useEffect(() => {
    if (selectedIndex === null || !thumbnailStripRef.current) return;
    const activeThumb = thumbnailStripRef.current.querySelector(
      `[data-index="${selectedIndex}"]`,
    );
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Unsplash-Style Dynamic Waterfall Masonry Grid */}
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subtle Archival Subheader Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-8 border-b border-border/70">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Unsplash-Style Visual Archive</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Displaying {photos.length} authentic moments captured across our regional vocational training centres.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border w-fit">
              Click any photo for full-screen view • Use arrow keys (← →)
            </span>
          </div>

          {/* Unsplash Waterfall Masonry Columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setSelectedIndex(index)}
                className="break-inside-avoid group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-border/80 dark:border-white/10 shadow-sm hover:shadow-2xl hover:border-primary/60 transition-all duration-300 cursor-pointer"
              >
                {/* Image Container with Natural Aspect Ratio */}
                <div
                  className={`relative w-full ${photo.aspectClass} overflow-hidden bg-slate-900`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Unsplash-Style Gradient Vignette Overlay (Visible on Hover) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Category Badge */}
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

          {/* Infinite Scroll Sentinel & Load More Indicator */}
          <div ref={sentinelRef} className="pt-12 pb-6 flex flex-col items-center justify-center">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground bg-muted/60 px-5 py-2.5 rounded-full border border-border">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Loading more authentic photographs...</span>
              </div>
            ) : hasNextPage ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                className="rounded-full px-6 text-xs font-bold gap-2 cursor-pointer border-border hover:border-primary/50"
              >
                <span>Load More Photographs</span>
              </Button>
            ) : photos.length > 0 ? (
              <p className="text-xs text-muted-foreground font-medium bg-muted/30 px-4 py-2 rounded-full border border-border/50">
                You have reached the end of the visual archives ({photos.length} photographs).
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* FULL-SCREEN Exhibition Lightbox Modal */}
      {selectedPhoto !== null && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-black/98 text-white overflow-hidden select-none animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* 1. Full-Screen Top Header Bar */}
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

            {/* Right: Controls & Close */}
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

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 transition-colors border border-white/15 cursor-pointer"
                aria-label="Close full-screen gallery"
                title="Close (Escape)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* 2. Full-Screen Photo Stage */}
          <main
            className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Photo Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={selectedIndex === 0}
              className="absolute left-3 sm:left-8 z-30 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous photograph"
              title={selectedIndex === 0 ? "First photograph" : "Previous (Left Arrow)"}
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>

            {/* High-Resolution Center Photo Container */}
            <div className="relative w-full h-full flex items-center justify-center">
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

            {/* Next Photo Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={
                isAdvancingNext ||
                (!hasNextPage && selectedIndex === photos.length - 1)
              }
              className="absolute right-3 sm:right-8 z-30 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next photograph"
              title={
                !hasNextPage && selectedIndex === photos.length - 1
                  ? "End of archive reached"
                  : "Next (Right Arrow)"
              }
            >
              {isAdvancingNext ? (
                <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin text-white" />
              ) : (
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
              )}
            </button>
          </main>

          {/* 3. Bottom Full-Width Bar with Centered Thumbnails */}
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
                {photos.map((photo, i) => (
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
    </>
  );
}
