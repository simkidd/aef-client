"use client";

import React from "react";
import { Building2, Handshake, Shield, Sparkles, Users, Award } from "lucide-react";

const partners = [
  {
    name: "Hovah West African Services Ltd",
    category: "Training & Implementation Partner",
    icon: Building2,
  },
  {
    name: "Community-Based Organizations",
    category: "Local Grassroot Partners",
    icon: Users,
  },
  {
    name: "Industry Trainers & Master Craftsmen",
    category: "Technical Faculty",
    icon: Award,
  },
  {
    name: "Regional Employer Networks",
    category: "Apprenticeship & Job Placement",
    icon: Handshake,
  },
  {
    name: "Renewable Energy Associations",
    category: "Green Tech Collaborators",
    icon: Sparkles,
  },
  {
    name: "Accredited Vocational Councils",
    category: "Certification Alignment",
    icon: Shield,
  },
];

const doubled = [...partners, ...partners];

export default function PartnersMarquee() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-muted/20 py-12">
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
          Strategic Alliances & Delivery Partners
        </p>
        <h2 className="text-lg sm:text-xl font-bold text-foreground mt-1 tracking-tight">
          Collaborating to Create Sustainable Economic Impact
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Left & Right subtle edge fade gradient masks */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 sm:w-36 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 sm:w-36 bg-gradient-to-l from-background to-transparent" />

        {/* Marquee ticker */}
        <div className="animate-marquee flex gap-6 px-4">
          {doubled.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="group flex min-w-[260px] sm:min-w-[280px] flex-shrink-0 items-center gap-3.5 rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {p.name}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {p.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
