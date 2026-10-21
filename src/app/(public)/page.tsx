import React from "react";
import { Metadata } from "next";
import Hero from "@/components/home/Hero";
import PartnersMarquee from "@/components/home/PartnersMarquee";
import ProgramsSection from "@/components/home/ProgramsSection";
import AboutSection from "@/components/home/AboutSection";
import CandidateJourneySection from "@/components/home/CandidateJourneySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GallerySection from "@/components/home/GallerySection";

import { galleryApi } from "@/lib/api";
import { GalleryPhotoItem } from "@/interfaces";

export const metadata: Metadata = {
  title: "Adele Empowerment Foundation | Vocational Skills & Youth Development NGO",
  description:
    "Adele Empowerment Foundation delivers fully funded vocational training, modern technology bootcamps, and starter toolkits to empower youth across Nigeria.",
};

export default async function HomePage() {
  let featuredPhotos: GalleryPhotoItem[] = [];

  try {
    const res = await galleryApi.getActive({ featured: true, limit: 6 });
    if (res?.data && Array.isArray(res.data)) {
      featuredPhotos = res.data;
    }
  } catch {
    featuredPhotos = [];
  }

  return (
    <div className="flex flex-col">
      {/* 1. Full-bleed cinematic hero with animated stats */}
      <Hero />

      {/* 2. Partners marquee ticker */}
      <PartnersMarquee />

      {/* 3. Six vocational + digital program tracks */}
      <ProgramsSection />

      {/* 4. About the Foundation — photo + mission + checklist */}
      <AboutSection />

      {/* 5. 4-step candidate journey — enrollment to certification */}
      <CandidateJourneySection />

      {/* 6. Graduate testimonials */}
      <TestimonialsSection />

      {/* 7. Masonry photo gallery with lightbox */}
      <GallerySection featuredPhotos={featuredPhotos} />
    </div>
  );
}
