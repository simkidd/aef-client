"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

interface ProgramTrack {
  title: string;
  tag: string;
  duration: string;
  description: string;
  image: string;
}

const programs: ProgramTrack[] = [
  {
    title: "Software & Cloud Tech",
    tag: "Digital Economy",
    duration: "6 Months",
    description:
      "Full-stack web architecture, mobile apps, database systems, DevOps, and cloud deployment pipelines for modern startups.",
    image: "/images/auth-hero-network.jpg",
  },
  {
    title: "Solar & Renewable Energy",
    tag: "Clean Energy",
    duration: "4 Months",
    description:
      "Photovoltaic array sizing, hybrid inverter installations, battery chemistry, energy storage, and off-grid mini-grid management.",
    image: "/images/auth-hero-solar.jpg",
  },
  {
    title: "Modern Agribusiness",
    tag: "Agriculture & Food",
    duration: "5 Months",
    description:
      "Precision hydroponics, greenhouse cultivation, poultry nutrition, value-addition processing, and cold-chain distribution.",
    image: "/images/auth-hero-social.jpg",
  },
  {
    title: "Creative Arts & Digital Media",
    tag: "Media & Design",
    duration: "4 Months",
    description:
      "Product UI/UX design, visual storytelling, 3D motion graphics, brand identity, and multi-channel digital communications.",
    image: "/images/auth-hero-network.jpg",
  },
  {
    title: "Fashion & Garment Technology",
    tag: "Vocational & Crafts",
    duration: "6 Months",
    description:
      "Industrial pattern engineering, haute couture tailoring, mass apparel finishing, quality assurance, and commercial studio startup.",
    image: "/images/auth-hero-makeup.jpg",
  },
  {
    title: "Culinary & Hospitality Arts",
    tag: "Hospitality Industry",
    duration: "4 Months",
    description:
      "Continental cuisine gastronomy, commercial pastry production, food safety HACCP protocols, and restaurant hospitality operations.",
    image: "/images/auth-hero-social.jpg",
  },
];

function ProgramCard({ program }: { program: ProgramTrack }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
      className="transition-all duration-200"
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
        className="group relative flex flex-col rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/40 h-full"
      >
        {/* Track Photo Banner */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-900">
          <Image
            src={program.image}
            alt={program.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/10">
              {program.tag}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-md px-3 py-1 text-[11px] font-bold shadow-sm">
              <Clock className="h-3 w-3" />
              {program.duration}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight mb-2.5">
            {program.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
            {program.description}
          </p>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2.5 transition-all"
            >
              <span>Enroll in this Track</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Fully Sponsored
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgramsSection() {
  return (
    <section id="programs" className="py-20 md:py-28 bg-slate-50/60 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
            Programs That Create Real Impact
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            We design intensive vocational and technology programs combining hands-on workshops,
            practical projects, masterclasses, and enterprise starter kits.
          </p>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((p, idx) => (
            <ProgramCard key={idx} program={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
