import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import GalleryViewer from "@/components/gallery/GalleryViewer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { galleryApi } from "@/lib/api";
import { GalleryPhotoItem } from "@/interfaces";

export const metadata: Metadata = {
  title: "Photo Gallery | Adele Empowerment Foundation",
  description:
    "A visual archive of practical vocational training workshops, clean energy field installations, and graduate milestones across Nigeria.",
};

export default async function GalleryPage() {
  let initialPhotos: GalleryPhotoItem[] = [];

  try {
    const res = await galleryApi.getActive({ page: 1, limit: 12 });
    if (res?.data && Array.isArray(res.data)) {
      initialPhotos = res.data;
    }
  } catch {
    // Graceful fallback to static photographs
    initialPhotos = [];
  }

  return (
    <div className="bg-background text-foreground">
      {/* 1. Page Hero */}
      <PageHero
        label="Photo Archive"
        title="Our Mission Captured in"
        titleAccent="Authentic Moments"
        subtitle="A visual record of our training workshops, field installations, and graduate milestones across our network of accredited centers in Nigeria."
        image="/images/auth-hero-social.jpg"
      />

      {/* 2. Gallery Filter & Interactive Grid (Client Component) */}
      <GalleryViewer initialPhotos={initialPhotos} />

      {/* 3. Call to Action */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white mb-3">
            Want to Witness Our Work Firsthand?
          </h2>
          <p className="text-slate-300 text-sm mb-8">
            Schedule a visit to any of our regional training centers in Lagos, Abuja, or Port Harcourt.
          </p>
          <Link href="/contact">
            <Button size="lg" className="rounded-full px-8 font-bold bg-primary text-primary-foreground gap-2">
              <span>Contact Admissions &amp; Center Directors</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
