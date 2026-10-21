"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { VOCATIONAL_SKILLS, StaticSkillArea } from "@/data/skills.data";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Building2,
  Wrench,
  Factory,
} from "lucide-react";

function CatalogSkillCard({
  skill,
  onSelect,
}: {
  skill: StaticSkillArea;
  onSelect: (skill: StaticSkillArea) => void;
}) {
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

        {/* Card Body: Title and Description only (No slots or cohorts) */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="font-heading font-black text-xl text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
            {skill.name}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
            {skill.description}
          </p>

          {/* Actions: View Details (Modal) & Quick Apply */}
          <div className="mt-auto pt-4 border-t border-border/60 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelect(skill)}
              className="flex-1 rounded-xl text-xs font-bold border-border hover:bg-muted cursor-pointer"
            >
              View Details
            </Button>

            <Link href={`/auth/register?skill=${skill.code}`} className="flex-1">
              <Button className="w-full rounded-xl text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer">
                <span>Apply</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgramsCatalog() {
  const searchParams = useSearchParams();
  const selectedTrackParam = searchParams.get("selected") || searchParams.get("track") || searchParams.get("skill");
  const [selectedSkill, setSelectedSkill] = useState<StaticSkillArea | null>(null);
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

  // Handle URL deep-linking (?selected=code or ?selected=id or ?skill=code)
  useEffect(() => {
    if (selectedTrackParam) {
      const cleanParam = selectedTrackParam.trim().toLowerCase();
      const found = VOCATIONAL_SKILLS.find(
        (s) =>
          s.code.toLowerCase() === cleanParam ||
          s.id.toLowerCase() === cleanParam ||
          s.name.toLowerCase().includes(cleanParam)
      );
      if (found) {
        setSelectedSkill(found);
      }
    }
  }, [selectedTrackParam]);

  const handleCloseModal = () => {
    setSelectedSkill(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("selected") || url.searchParams.has("track") || url.searchParams.has("skill")) {
        url.searchParams.delete("selected");
        url.searchParams.delete("track");
        url.searchParams.delete("skill");
        window.history.replaceState(null, "", url.pathname + (url.search || ""));
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    if (selectedSkill) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSkill]);

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
                    "px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border",
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
            <CatalogSkillCard
              key={skill.code}
              skill={skill}
              onSelect={setSelectedSkill}
            />
          ))}
        </div>
      </div>

      {/* Skill Details Modal */}
      {selectedSkill && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Banner Header */}
            <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-900 rounded-t-3xl">
              <Image
                src={selectedSkill.image}
                alt={selectedSkill.name}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/60" />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors border border-white/10 backdrop-blur-md cursor-pointer"
                aria-label="Close details modal"
              >
                <span className="text-sm font-bold px-1">&times;</span>
              </button>

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10">
                  {selectedSkill.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground backdrop-blur-md px-3 py-1 text-xs font-bold shadow-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{selectedSkill.durationWeeks} Weeks Intensive</span>
                </span>
              </div>

              {/* Title Lockup */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  {selectedSkill.name}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Sponsoring Program Framework Callout */}
              <div className="p-5 rounded-2xl bg-muted/50 border border-border/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Delivered Under Framework</span>
                </span>
                <p className="text-sm font-bold text-foreground">
                  {selectedSkill.framework}
                </p>
                <p className="text-xs text-muted-foreground">
                  Organizing Partners: {selectedSkill.organizer}
                </p>
              </div>

              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Trade Overview &amp; Curriculum Scope
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Key Specifications Grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Certification Award</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedSkill.certificationType}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Trade Code &amp; Status</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedSkill.code} &bull; Open for Admissions
                  </p>
                </div>
              </div>

              {/* Practical Workshop Facilities & Equipment */}
              <div className="p-5 rounded-2xl bg-muted/30 border border-border/80 space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Factory className="h-3.5 w-3.5 text-primary" />
                    <span>Hands-on Workshop Facilities:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkill.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-card text-foreground border border-border"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 text-primary" />
                    <span>Practical Training Tools Provided:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkill.equipment.map((eq, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-card text-foreground border border-border"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accreditation Guarantee */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                <span>
                  All verified graduates receive tamper-proof certificates with QR verification,
                  enterprise starter toolkit grants, and eligibility for business incubation.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto rounded-xl font-semibold text-xs h-11 px-6 border-border cursor-pointer"
                >
                  Close
                </Button>

                <Link
                  href={`/auth/register?skill=${selectedSkill.code}`}
                  className="w-full sm:flex-1"
                >
                  <Button className="w-full rounded-xl font-bold text-xs h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 cursor-pointer">
                    <span>Apply for {selectedSkill.name}</span>
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
