"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  label: string;
  title: string;
  subtitle: string;
  image?: string;
  imageAlt?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function PageHero({
  label,
  title,
  subtitle,
  image = "/images/auth-hero-social.jpg",
  imageAlt = "Adele Empowerment Foundation vocational training session",
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20 border-b border-white/10 bg-slate-950 text-white min-h-[46vh] lg:min-h-[52vh] flex items-end">
      {/* Background photo: authentic vocational photography with consistent multi-stop overlay & subtle grid */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover opacity-55"
          priority
        />
        {/* Consistent multi-stop dark overlay matching homepage hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/60 to-slate-950/90" />
        {/* Subtle grid pattern overlay matching homepage hero */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Optional Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="h-3 w-3 text-white/40" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* NGO Category Badge — matching homepage hero badge style */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-primary mb-4 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>{label}</span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-4 max-w-3xl">
          {title}
        </h1>

        {/* Subtitle — exact human-readable typography */}
        <p className="text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed font-normal">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
