"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users2,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "50,000+", label: "Youths Trained & Certified", icon: Users2 },
  { value: "12+", label: "Multi-Skill Training Centres", icon: Building2 },
  { value: "100%", label: "Fully Sponsored & Funded", icon: ShieldCheck },
  { value: "94%", label: "Enterprise & Employment Rate", icon: TrendingUp },
];

export default function Hero() {
  return (
    <div>
      {/* 1. Initial adele-v2 Hero Section with background photo & non-gradient typography */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 border-b border-white/10 bg-slate-950 text-white min-h-[85vh] flex items-center">
        {/* Background photo: authentic practical vocational training */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/auth-hero-network.jpg"
            alt="Practical vocational training session at Adele Empowerment Foundation"
            fill
            className="object-cover opacity-55"
            priority
          />
          {/* Subtle multi-stop dark overlay for readability while keeping the photo clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/60 to-slate-950/90" />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-primary mb-6 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Cohort 2026 Admissions Now Open</span>
            </div>

            {/* Headline — initial adele-v2 text, solid white and solid primary, NO gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
              Empowering Communities Through{" "}
              <span className="text-primary font-extrabold">
                Practical Skills
              </span>{" "}
              &amp; Innovation
            </h1>

            {/* Subtitle — exact initial text */}
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-2xl font-normal">
              Adele Empowerment Foundation delivers fully-funded vocational
              education, digital technology bootcamps, and enterprise starter
              support to drive economic independence across Africa.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-bold shadow-lg shadow-primary/30 h-12 px-7 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-all"
                >
                  <span>Apply for 2026 Cohort</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/programs" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-semibold h-12 px-7 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm hover:scale-105 transition-all"
                >
                  <span>Explore Available Programs</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Trust metrics pill */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-white/80">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                No Tuition Fees Required
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Certified by Adele Foundation
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                12 Accredited Regional Centres
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Initial adele-v2 Impact Highlights Strip */}
      <section className="border-b border-border/60 bg-muted/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary mb-1">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
