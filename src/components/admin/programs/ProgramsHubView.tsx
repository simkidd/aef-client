"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Briefcase,
  Sparkles,
  GraduationCap,
  Layers,
  BookOpen,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ProgramsManagementView } from "./ProgramsManagementView";
import { SkillsRegistryView } from "./skills/SkillsRegistryView";
import { CohortsManagementView } from "./cohorts/CohortsManagementView";
import { useProgramsQuery, useSkillAreasQuery, useCohortsQuery } from "@/hooks/queries";

export type ProgramTab = "programs" | "skills" | "cohorts";

export interface ProgramsHubViewProps {
  defaultTab?: ProgramTab;
}

export function ProgramsHubView({
  defaultTab = "programs",
}: ProgramsHubViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlTab = searchParams.get("tab") as ProgramTab | null;
  const validTabs: ProgramTab[] = ["programs", "skills", "cohorts"];
  const currentTab = urlTab && validTabs.includes(urlTab) ? urlTab : defaultTab;

  const [activeTab, setActiveTab] = useState<ProgramTab>(currentTab);

  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab) && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (val: string) => {
    const newTab = val as ProgramTab;
    setActiveTab(newTab);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", newTab);
      const targetPath =
        pathname.includes("/admin/programs/")
          ? "/admin/programs"
          : pathname;
      router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
    });
  };

  const { data: programs = [] } = useProgramsQuery();
  const { data: skills = [] } = useSkillAreasQuery();
  const { data: cohorts = [] } = useCohortsQuery();

  return (
    <div className="space-y-6">
      {/* Unified Master Header */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Layers className="h-3.5 w-3.5" />
            Curriculum & Capacity Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Programs & Curriculum Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
            Design multi-disciplinary empowerment programs, manage technical trade disciplines & certification
            standards, and configure live training cohorts with centre-specific capacity allocations.
          </p>
        </div>

        {/* 3-Pillar Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Pillar 1: Programs */}
          <Card
            onClick={() => handleTabChange("programs")}
            className={`p-4 cursor-pointer transition-all border ${
              activeTab === "programs"
                ? "border-primary/50 bg-primary/5 shadow-sm"
                : "hover:border-slate-300 dark:hover:border-slate-700 bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === "programs"
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Vocational Tracks
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    Training Programs
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-foreground">
                {programs.length}
              </span>
            </div>
          </Card>

          {/* Pillar 2: Skills & Trades */}
          <Card
            onClick={() => handleTabChange("skills")}
            className={`p-4 cursor-pointer transition-all border ${
              activeTab === "skills"
                ? "border-amber-500/50 bg-amber-500/5 shadow-sm"
                : "hover:border-slate-300 dark:hover:border-slate-700 bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === "skills"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Disciplines
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    Skills & Trades
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-foreground">
                {skills.length}
              </span>
            </div>
          </Card>

          {/* Pillar 3: Cohorts */}
          <Card
            onClick={() => handleTabChange("cohorts")}
            className={`p-4 cursor-pointer transition-all border ${
              activeTab === "cohorts"
                ? "border-emerald-500/50 bg-emerald-500/5 shadow-sm"
                : "hover:border-slate-300 dark:hover:border-slate-700 bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === "cohorts"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Live Batches
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    Training Cohorts
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-foreground">
                {cohorts.length}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs Switcher and Content */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <div className="flex items-center justify-between border-b border-border pb-2 overflow-x-auto">
          <TabsList className="bg-muted p-1 rounded-xl h-10 w-fit">
            <TabsTrigger
              value="programs"
              className="gap-2 text-xs font-semibold px-3"
            >
              <Briefcase className="h-4 w-4" />
              <span>Programs & Initiatives</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-background text-foreground/80 border">
                {programs.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="skills"
              className="gap-2 text-xs font-semibold px-3"
            >
              <Sparkles className="h-4 w-4" />
              <span>Skills & Trades</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-background text-foreground/80 border">
                {skills.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="cohorts"
              className="gap-2 text-xs font-semibold px-3"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Training Cohorts</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-background text-foreground/80 border">
                {cohorts.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Programs */}
        <TabsContent value="programs" className="mt-0 focus-visible:outline-none">
          <ProgramsManagementView hideHeader />
        </TabsContent>

        {/* Tab 2: Skills & Trades */}
        <TabsContent value="skills" className="mt-0 focus-visible:outline-none">
          <SkillsRegistryView hideHeader />
        </TabsContent>

        {/* Tab 3: Cohorts */}
        <TabsContent value="cohorts" className="mt-0 focus-visible:outline-none">
          <CohortsManagementView hideHeader />
        </TabsContent>
      </Tabs>
    </div>
  );
}
