"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { GalleryPhotoItem } from "@/interfaces";

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

interface GallerySectionProps {
  featuredPhotos?: GalleryPhotoItem[];
}

const images: GalleryImage[] = [
  {
    src: "/images/auth-hero-social.jpg",
    alt: "Adele Foundation graduation ceremony",
    caption: "Celebrating program graduates equipped for new opportunities",
  },
  {
    src: "/images/auth-hero-network.jpg",
    alt: "Digital skills training session",
    caption: "Participants gaining practical digital and ICT skills",
  },
  {
    src: "/images/auth-hero-solar.jpg",
    alt: "Renewable solar energy installation",
    caption: "Hands-on clean energy and electrical engineering field practice",
  },
  {
    src: "/images/auth-hero-makeup.jpg",
    alt: "Vocational skills training workshop",
    caption: "Creative arts, styling, and garment craftsmanship",
  },
  {
    src: "/images/auth-hero-network.jpg",
    alt: "Adele Foundation training classroom session",
    caption: "Industry facilitators guiding participants through modern tech curriculum",
  },
  {
    src: "/images/auth-hero-social.jpg",
    alt: "Mentorship session at Adele Foundation",
    caption: "Mentorship and career guidance sessions for graduates",
  },
];

export default function GallerySection({ featuredPhotos }: GallerySectionProps = {}) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  const displayImages: GalleryImage[] =
    featuredPhotos && featuredPhotos.length > 0
      ? featuredPhotos.map((p) => ({
          src: p.imageUrl || p.src || "/images/auth-hero-social.jpg",
          alt: p.title,
          caption: p.description || p.title,
        }))
      : images;

  return (
    <section id="gallery" className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-900/30 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Our Impact in Action
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
            Real Moments From Our Programs
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            A glimpse into the lives we are transforming through skills training, community engagement, and dedicated mentorship.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="masonry">
          {displayImages.map((img, i) => (
            <div
              key={i}
              className="masonry-item group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ minHeight: `${180 + (i % 3) * 60}px` }}
              onClick={() => setSelected(img)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={500}
                height={300 + (i % 3) * 80}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading={i < 2 ? "eager" : "lazy"}
              />

              {/* Hover overlay without zoom in icon */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/75 transition-all duration-300 flex flex-col items-center justify-center p-4">
                <p className="text-white text-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 drop-shadow-md">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-video">
              <Image
                src={selected.src}
                alt={selected.alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 px-6 py-5">
              <p className="text-white text-base font-semibold">{selected.caption}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 bg-white/15 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition-colors"
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
