"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { UserCheck, Fingerprint, Cpu, Calendar, Clock, ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DailyAttendanceSheetView } from "./DailyAttendanceSheetView";
import { BiometricsManagementView } from "../biometrics/BiometricsManagementView";

export type AttendanceTab = "sheet" | "biometrics";

export interface AttendanceHubViewProps {
  defaultTab?: AttendanceTab;
}

export function AttendanceHubView({
  defaultTab = "sheet",
}: AttendanceHubViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlTab = searchParams.get("tab") as AttendanceTab | null;
  const validTabs: AttendanceTab[] = ["sheet", "biometrics"];
  const currentTab = urlTab && validTabs.includes(urlTab) ? urlTab : defaultTab;

  const [activeTab, setActiveTab] = useState<AttendanceTab>(currentTab);

  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab) && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (val: string) => {
    const newTab = val as AttendanceTab;
    setActiveTab(newTab);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", newTab);
      const targetPath = pathname.includes("/admin/training/biometrics")
        ? "/admin/training/attendance"
        : pathname;
      router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="space-y-6">
      {/* Unified Master Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
            <Clock className="h-3.5 w-3.5" />
            Operations & Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Attendance & Biometrics Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Track daily training attendance rolls, review automated grace period deductions,
            manage manual corrections with immutable audit preservation, and monitor turnstile hardware telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Link href="/terminal">
            <Button
              size="sm"
              className="text-xs h-9 gap-1.5 font-semibold bg-primary text-primary-foreground shadow-xs"
            >
              <Fingerprint className="h-4 w-4" />
              <span>Launch Kiosk Terminal</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Switcher and Content */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <div className="flex items-center justify-between border-b border-border pb-2">
          <TabsList className="bg-muted p-1 rounded-xl h-10 w-fit">
            <TabsTrigger
              value="sheet"
              className="gap-2 text-xs font-semibold px-3"
            >
              <UserCheck className="h-4 w-4" />
              <span>Daily Attendance Rolls</span>
            </TabsTrigger>

            <TabsTrigger
              value="biometrics"
              className="gap-2 text-xs font-semibold px-3"
            >
              <Cpu className="h-4 w-4" />
              <span>Scanners & Hardware Logs</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Daily Attendance Rolls */}
        <TabsContent value="sheet" className="mt-0 focus-visible:outline-none">
          <DailyAttendanceSheetView hideHeader />
        </TabsContent>

        {/* Tab 2: Hardware Devices & Raw Scans */}
        <TabsContent value="biometrics" className="mt-0 focus-visible:outline-none">
          <BiometricsManagementView hideHeader />
        </TabsContent>
      </Tabs>
    </div>
  );
}
