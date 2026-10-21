"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { VOCATIONAL_SKILLS, StaticSkillArea } from "@/data/skills.data";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

function CatalogSkillCard({ skill }: { skill: StaticSkillArea }) {
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
          <h3 className="font-heading font-black text-xl text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
            {skill.name}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {skill.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProgramsCatalog() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Dynamically generate filter categories from static skills data
  const filterTabs = useMemo(() => {
    const tabs: { id: string; label: string }[] = [{ id: "all", label: "All Skills" }];
    const categories = Array.from(new Set(VOCATIONAL_SKILLS.map((s) => s.category)));
    categories.forEach((cat) => {
      tabs.push({ id: cat, label: cat });
    });
    return tabs;
  }, []);

  // Filter skills based on active category tab
  const filteredSkills = useMemo(() => {
    if (activeFilter === "all") return VOCATIONAL_SKILLS;
    return VOCATIONAL_SKILLS.filter((s) => s.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Tabs */}
        {filterTabs.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    "h-10 px-5 rounded-full text-xs font-bold transition-all cursor-pointer border inline-flex items-center justify-center",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border/80 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Skills Grid - Instant static render */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSkills.map((skill) => (
            <CatalogSkillCard key={skill.code} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
