"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  FileText,
  Fingerprint,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ApplicationsPipelineView } from "./applications/ApplicationsPipelineView";
import { BiometricRegistrationDeskView } from "./enrollment/BiometricRegistrationDeskView";
import { ActiveTraineesView } from "./trainees/ActiveTraineesView";
import { useApplicationsQuery, useEnrollmentQueueQuery } from "@/hooks/queries";

export type BeneficiaryTab = "applications" | "enrollment" | "trainees";

export interface BeneficiariesHubViewProps {
  defaultTab?: BeneficiaryTab;
}

export function BeneficiariesHubView({
  defaultTab = "applications",
}: BeneficiariesHubViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Determine initial tab from URL query param, defaultTab prop, or fallback
  const urlTab = searchParams.get("tab") as BeneficiaryTab | null;
  const validTabs: BeneficiaryTab[] = ["applications", "enrollment", "trainees"];
  const currentTab = urlTab && validTabs.includes(urlTab) ? urlTab : defaultTab;

  const [activeTab, setActiveTab] = useState<BeneficiaryTab>(currentTab);

  // Sync state with URL parameter if it changes externally
  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab) && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  // Handle Tab Change and update URL
  const handleTabChange = (val: string) => {
    const newTab = val as BeneficiaryTab;
    setActiveTab(newTab);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", newTab);
      // If we are at a legacy route like /admin/beneficiaries/applications, route to /admin/beneficiaries
      const targetPath = pathname.includes("/admin/beneficiaries/")
        ? "/admin/beneficiaries"
        : pathname;
      router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
    });
  };

  // Pipeline stats counts
  const { data: appsData } = useApplicationsQuery({ limit: 1 });
  const { data: queueData } = useEnrollmentQueueQuery({ limit: 1 });
  const { data: traineesData } = useEnrollmentQueueQuery({
    status: "Active",
    limit: 1,
  });

  const totalApplications = appsData?.pagination?.total ?? 0;
  const totalInQueue = queueData?.pagination?.total ?? 0;
  const totalActiveTrainees = traineesData?.pagination?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Unified Master Header */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Users className="h-3.5 w-3.5" />
            Candidate-to-Trainee Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Beneficiary Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
            Streamlined end-to-end lifecycle: review incoming candidate applications, onboard
            selected youth via biometric fingerprint capture, and manage active trainees across all cohorts.
          </p>
        </div>

        {/* 3-Step Lifecycle KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Step 1: Applications */}
          <Card
            onClick={() => handleTabChange("applications")}
            className={`p-4 cursor-pointer transition-all border ${
              activeTab === "applications"
                ? "border-primary/50 bg-primary/5 shadow-sm"
                : "hover:border-slate-300 dark:hover:border-slate-700 bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === "applications"
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Step 1 · In Review
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    Applications Pipeline
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-foreground">
                {totalApplications}
              </span>
            </div>
          </Card>

          {/* Step 2: Verification & Biometrics */}
          <Card
            onClick={() => handleTabChange("enrollment")}
            className={`p-4 cursor-pointer transition-all border ${
              activeTab === "enrollment"
                ? "border-amber-500/50 bg-amber-500/5 shadow-sm"
                : "hover:border-slate-300 dark:hover:border-slate-700 bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === "enrollment"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Fingerprint className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Step 2 · Onboarding
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    Biometric Desk
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-foreground">
                {totalInQueue}
              </span>
            </div>
          </Card>

          {/* Step 3: Active Trainees */}
          <Card
            onClick={() => handleTabChange("trainees")}
            className={`p-4 cursor-pointer transition-all border ${
              activeTab === "trainees"
                ? "border-emerald-500/50 bg-emerald-500/5 shadow-sm"
                : "hover:border-slate-300 dark:hover:border-slate-700 bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === "trainees"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Step 3 · Enrolled
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    Active Trainees
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-foreground">
                {totalActiveTrainees}
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
              value="applications"
              className="gap-2 text-xs font-semibold px-3"
            >
              <FileText className="h-4 w-4" />
              <span>Applications</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-background text-foreground/80 border">
                {totalApplications}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="enrollment"
              className="gap-2 text-xs font-semibold px-3"
            >
              <Fingerprint className="h-4 w-4" />
              <span>Biometric Desk</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-background text-foreground/80 border">
                {totalInQueue}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="trainees"
              className="gap-2 text-xs font-semibold px-3"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Active Trainees</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-background text-foreground/80 border">
                {totalActiveTrainees}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Applications */}
        <TabsContent value="applications" className="mt-0 focus-visible:outline-none">
          <ApplicationsPipelineView hideHeader />
        </TabsContent>

        {/* Tab 2: Biometric Desk */}
        <TabsContent value="enrollment" className="mt-0 focus-visible:outline-none">
          <BiometricRegistrationDeskView hideHeader />
        </TabsContent>

        {/* Tab 3: Active Trainees */}
        <TabsContent value="trainees" className="mt-0 focus-visible:outline-none">
          <ActiveTraineesView hideHeader />
        </TabsContent>
      </Tabs>
    </div>
  );
}
