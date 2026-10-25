"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Heart, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 bg-slate-950 text-white overflow-hidden">
      {/* Ambient glowing orb background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/25 blur-[130px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-teal-500/15 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Pulsing Icon */}
        <ScrollReveal distance={16} duration={450}>
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl scale-150 animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/30">
              <GraduationCap className="h-9 w-9 text-primary" />
            </div>
          </div>
        </ScrollReveal>

        {/* Headline & Subtitle */}
        <ScrollReveal distance={20} duration={500} delay={100}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5">
            Be Part of Creating{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">
              Real Impact
            </span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed max-w-xl mb-10 mx-auto">
            Join our programs, support our mission, or become a delivery partner to
            empower thousands of youth and communities across Nigeria with real, marketable skills.
          </p>
        </ScrollReveal>

        {/* Primary CTA & Secondary Actions Row */}
        <ScrollReveal distance={20} duration={500} delay={200} className="w-full sm:w-auto flex flex-col items-center">
          <Link href="/auth/register" className="w-full sm:w-auto mb-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 rounded-full gap-2 transition-all hover:scale-105"
            >
              <span>Apply for a Program Now</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-1 w-full sm:w-auto">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-white hover:bg-white/10 transition-all text-sm font-semibold">
                <Heart className="h-4 w-4 text-rose-400" />
                Support Our Mission
              </button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-white hover:bg-white/10 transition-all text-sm font-semibold">
                <Handshake className="h-4 w-4 text-teal-400" />
                <span>Partner With Us</span>
              </button>
            </Link>
          </div>

          {/* Trust note */}
          <p className="text-slate-600 text-xs mt-10 max-w-sm leading-relaxed text-center">
            Our programs are 100% sponsored — no tuition or enrollment fees required. Open to
            eligible youth aged 18–35 across all Adele regional centres.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
