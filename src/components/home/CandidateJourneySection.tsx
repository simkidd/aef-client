"use client";

import React from "react";
import { FileCheck2, Fingerprint, GraduationCap, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

const steps = [
  {
    step: "01",
    title: "Online Application & NIN",
    desc: "Select your preferred vocation, choose your nearest regional centre, and submit your verified National Identity profile.",
    icon: FileCheck2,
    accent: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    step: "02",
    title: "Biometric Enrollment",
    desc: "Complete in-person verification and biometric fingerprint capture at your designated training facility.",
    icon: Fingerprint,
    accent: "from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    step: "03",
    title: "Immersive Practical Training",
    desc: "Master skills with industry facilitators, state-of-the-art tools, real projects, and mandatory daily biometric attendance.",
    icon: GraduationCap,
    accent: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    step: "04",
    title: "Accredited Certification",
    desc: "Graduate with an authentic, QR-verifiable Adele certificate and qualify for enterprise starter kits and employer placement.",
    icon: Award,
    accent: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

export default function CandidateJourneySection() {
  return (
    <section className="py-20 md:py-28 bg-slate-50/80 dark:bg-slate-900/40 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal distance={20} duration={500}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              The Adele Standard
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
              Your Journey From Enrollment to Career
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
              Our structured, accountable system guarantees that every certified graduate possesses
              demonstrated practical competence verified by biometric attendance.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <ScrollReveal key={i} delay={i * 80} distance={20} duration={450}>
                <div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-7 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 h-full">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-black text-primary/25 tracking-tight group-hover:text-primary transition-colors">
                        {st.step}
                      </span>
                      <div className={`p-3 rounded-2xl border bg-gradient-to-br ${st.accent}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {st.title}
                    </h3>

                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/60">
                    <span className="text-[11px] font-bold text-primary inline-flex items-center gap-1">
                      Stage {i + 1} of 4
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom CTA banner */}
        <ScrollReveal delay={200} distance={16}>
          <div className="mt-12 text-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4"
            >
              <span>Learn more about admission requirements & centre locations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
