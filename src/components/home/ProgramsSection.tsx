"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { VOCATIONAL_SKILLS, StaticSkillArea } from "@/data/skills.data";

function SkillCard({ skill }: { skill: StaticSkillArea }) {
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
        {/* Skill Photo Banner */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-900">
          <Image
            src={skill.image}
            alt={skill.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/10 shadow-sm flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>{skill.category}</span>
            </span>
          </div>
        </div>

        {/* Card Body: Title and Description only */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight mb-2 leading-snug">
            {skill.name}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {skill.description}
          </p>
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
            What You Can Learn
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
            Vocational Skills That Transform Careers
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            Choose from industry-accredited technical, digital, and vocational trades — combining hands-on workshop mastery, practical projects, and starter toolkits.
          </p>
        </div>

        {/* Skills Cards Grid - Instant static render */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VOCATIONAL_SKILLS.slice(0, 6).map((skill) => (
            <SkillCard key={skill.code} skill={skill} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/programs">
            <button
              type="button"
              className="h-12 px-8 rounded-full font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 hover:scale-105 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Explore Vocational Skills</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
