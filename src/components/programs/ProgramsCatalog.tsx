"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export interface ProgramDetail {
  id: string;
  category: "tech" | "energy" | "agri" | "vocational" | "culinary" | "media";
  title: string;
  tag: string;
  duration: string;
  image: string;
  description: string;
  curriculum: string[];
  toolkitProvided: string;
}

export const allPrograms: ProgramDetail[] = [
  {
    id: "software-cloud",
    category: "tech",
    title: "Software & Cloud Tech",
    tag: "Digital Economy",
    duration: "6 Months Intensive",
    image: "/images/auth-hero-network.jpg",
    description:
      "Full-stack software engineering, modern JavaScript frameworks, API backend services, cloud deployment, and collaborative GitHub workflows.",
    curriculum: [
      "HTML5, Modern CSS & Responsive UI Systems",
      "Full-Stack TypeScript, React & Node.js Architecture",
      "PostgreSQL, MongoDB & Database Modeling",
      "Git, Docker Containerization & Cloud Deployment",
    ],
    toolkitProvided:
      "Laptop subsidy support, internet stipend, cloud compute credits, and free code repository access.",
  },
  {
    id: "solar-energy",
    category: "energy",
    title: "Solar & Clean Energy Tech",
    tag: "Renewable Energy",
    duration: "4 Months Fieldwork",
    image: "/images/auth-hero-solar.jpg",
    description:
      "Photovoltaic array sizing, hybrid inverter installations, battery chemistry, energy storage, and off-grid mini-grid management for homes and businesses.",
    curriculum: [
      "Solar Radiation & Photovoltaic System Design",
      "Inverter, Charge Controller & Lithium Battery Wiring",
      "Industrial Health, Safety & Rooftop Protocols",
      "System Maintenance, Troubleshooting & Commissioning",
    ],
    toolkitProvided:
      "Professional electrical multimeter, insulated safety toolkit, solar crimping pliers, and PPE set.",
  },
  {
    id: "modern-agribusiness",
    category: "agri",
    title: "Modern Agribusiness & Processing",
    tag: "Agriculture & Food",
    duration: "5 Months Practical",
    image: "/images/auth-hero-social.jpg",
    description:
      "Precision soilless hydroponics, greenhouse climate cultivation, commercial poultry nutrition, value-addition packaging, and cold-chain distribution.",
    curriculum: [
      "Greenhouse Operations & Micro-Climate Control",
      "Commercial Broiler, Layer & Fish Feed Optimization",
      "Post-Harvest Food Preservation & Packaging",
      "Agri-Finance, Pricing Strategy & Offtake Contracts",
    ],
    toolkitProvided:
      "Starter seedling pack, water testing meter, solar irrigation accessories, and farm management ledger.",
  },
  {
    id: "fashion-garment",
    category: "vocational",
    title: "Fashion & Garment Technology",
    tag: "Haute Couture & Apparel",
    duration: "6 Months Studio",
    image: "/images/auth-hero-makeup.jpg",
    description:
      "Industrial pattern engineering, bespoke tailoring, bridal design, apparel finishing, quality assurance, and commercial studio management.",
    curriculum: [
      "Anatomical Body Measurement & Master Pattern Drafting",
      "Industrial Straight-Stitch & Overlock Machine Mastery",
      "Textile Chemistry, Fabric Selection & Lining Construction",
      "Fashion Branding, Catalog Production & Pricing",
    ],
    toolkitProvided:
      "Industrial sewing machine starter grant voucher, master cutting shears, pattern grading rulers, and mannequin access.",
  },
  {
    id: "culinary-arts",
    category: "culinary",
    title: "Culinary Arts & Hospitality",
    tag: "Hospitality Industry",
    duration: "4 Months Kitchen",
    image: "/images/auth-hero-social.jpg",
    description:
      "Continental cuisine gastronomy, commercial pastry production, food safety HACCP protocols, and restaurant hospitality operations.",
    curriculum: [
      "Professional Knife Skills & Food Safety HACCP Systems",
      "African Gourmet Cuisine & Continental Dishes",
      "Artisan Pastry, Bakery & Event Catering Logistics",
      "Costing, Inventory Control & Menu Development",
    ],
    toolkitProvided:
      "Professional chef knife set, baking thermometer, digital kitchen scale, and uniform chef whites.",
  },
  {
    id: "digital-media",
    category: "media",
    title: "Creative Arts & Digital Media",
    tag: "Media & Design",
    duration: "4 Months Studio",
    image: "/images/auth-hero-network.jpg",
    description:
      "Product UI/UX design, visual storytelling, 3D motion graphics, brand identity systems, and multi-channel digital communications.",
    curriculum: [
      "User Interface (UI) Design & Figma Prototyping",
      "Digital Illustration & Commercial Brand Identity",
      "Motion Video Editing & Visual Storytelling",
      "Client Proposal Drafting & Freelance Portfolios",
    ],
    toolkitProvided:
      "Drawing tablet, creative suite software license stipend, and professional design asset libraries.",
  },
];

export default function ProgramsCatalog() {
  const [selectedProgram, setSelectedProgram] = useState<ProgramDetail | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProgram(null);
    };
    if (selectedProgram) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProgram]);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPrograms.map((prog) => (
            <div
              key={prog.id}
              className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
            >
              {/* Image banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <Image
                  src={prog.image}
                  alt={prog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/10">
                    {prog.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-emerald-950 backdrop-blur-md px-3 py-1 text-[11px] font-bold shadow-sm">
                    <Clock className="h-3 w-3" />
                    {prog.duration}
                  </span>
                </div>
              </div>

              {/* Minimal Body (No Icons) */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="font-heading font-black text-xl text-foreground group-hover:text-primary transition-colors mb-2.5 leading-snug">
                  {prog.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6">
                  {prog.description}
                </p>

                {/* Actions: View Details (Modal) & Quick Apply */}
                <div className="mt-auto pt-4 border-t border-border/60 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedProgram(prog)}
                    className="flex-1 rounded-xl text-xs font-bold border-border hover:bg-muted"
                  >
                    View Details
                  </Button>

                  <Link href={`/auth/register?track=${prog.id}`} className="flex-1">
                    <Button className="w-full rounded-xl text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs">
                      <span>Apply</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Details Modal (No Icons) */}
      {selectedProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Banner Header */}
            <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-900 rounded-t-3xl">
              <Image
                src={selectedProgram.image}
                alt={selectedProgram.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/60" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors border border-white/10 backdrop-blur-md"
                aria-label="Close details modal"
              >
                <span className="text-sm font-bold px-1">&times;</span>
              </button>

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10">
                  {selectedProgram.tag}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-emerald-950 backdrop-blur-md px-3 py-1 text-xs font-bold shadow-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedProgram.duration}
                </span>
              </div>

              {/* Title Lockup (No Icon) */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  {selectedProgram.title}
                </h2>
                <p className="text-xs text-emerald-300 mt-1 font-semibold uppercase tracking-wider">
                  100% Fully Funded Vocational Track
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Program Overview
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Full Curriculum Modules */}
              <div className="p-5 rounded-2xl bg-muted/40 border border-border/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Curriculum &amp; Hands-on Modules:</span>
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {selectedProgram.curriculum.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graduation Starter Kit Guarantee */}
              <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 font-bold text-sm text-primary mb-1.5">
                  <PackageCheck className="h-4 w-4" />
                  <span>Graduation Starter Kit Guarantee:</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedProgram.toolkitProvided}
                </p>
              </div>

              {/* Accreditation Guarantee */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span>
                  Graduates receive an accredited Adele Certificate and qualify for regional enterprise mentorship and job placement support.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedProgram(null)}
                  className="w-full sm:w-auto rounded-xl font-semibold text-xs h-11 px-6 border-border"
                >
                  Close
                </Button>

                <Link href={`/auth/register?track=${selectedProgram.id}`} className="w-full sm:flex-1">
                  <Button className="w-full rounded-xl font-bold text-xs h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20">
                    <span>Apply for {selectedProgram.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
