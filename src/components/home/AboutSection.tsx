"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Award } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const checklist = [
  "Hands-on vocational and tech training focused on practical in-demand skills",
  "Dedicated mentorship, industry masterclasses, and tailored career guidance",
  "Access to enterprise starter toolkits, micro-grants, and alumni employer networks",
  "National Identity Number (NIN) validation and biometric daily attendance tracking",
  "Official, QR-verifiable Adele certificate accredited for global employers",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background border-t border-border/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: Featured Training Session Photography */}
          <ScrollReveal direction="right" distance={24} duration={600}>
            <div className="relative">
              {/* Decorative background accent border */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-primary/10 border border-primary/20 -z-10" />

              <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-border">
                <Image
                  src="/images/auth-hero-social.jpg"
                  alt="Adele Empowerment Foundation training workshop in progress"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Floating Highlight Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary text-primary-foreground">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Impact Commitment
                      </p>
                      <p className="text-sm font-semibold text-white">
                        Zero-Tuition, Fully Funded Education
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-xs text-slate-300 font-medium">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Verified Centers
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT: Narrative, Mission & Checklist */}
          <ScrollReveal direction="left" distance={24} duration={600} delay={100}>
            <div className="flex flex-col justify-center">
              {/* Section Tag */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-5 w-1 bg-primary rounded-full" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Who We Are
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-6">
                Creating Opportunities That Change Lives Across Nigeria
              </h2>

              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Adele Empowerment Foundation is dedicated to empowering youth and vulnerable communities
                through practical skills acquisition, modern technology bootcamps, and enterprise support.
                We bridge the gap between human potential and sustainable economic self-reliance.
              </p>

              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                Our systematic approach combines rigorous curriculum, professional tooling, biometric
                attendance tracking, and direct linkage to job placements, apprenticeship pathways, and
                small business starter kits.
              </p>

              {/* Checklist */}
              <ul className="space-y-3.5 mb-10">
                {checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="p-0.5 rounded-full bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/auth/register">
                  <button
                    type="button"
                    className="h-12 px-7 rounded-full font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 hover:scale-105 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>Join Our 2026 Cohort</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/programs">
                  <button
                    type="button"
                    className="h-12 px-7 rounded-full font-semibold text-sm border border-border/80 hover:border-primary/40 bg-card hover:bg-muted text-foreground transition-all cursor-pointer inline-flex items-center justify-center"
                  >
                    <span>Explore Vocational Skills</span>
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
