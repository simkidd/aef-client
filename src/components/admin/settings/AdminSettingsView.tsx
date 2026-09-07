"use client";

import React from "react";
import { Building2, Clock, ShieldCheck, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrgProfileSettingsForm } from "./OrgProfileSettingsForm";
import { AttendancePolicySettingsForm } from "./AttendancePolicySettingsForm";

export function AdminSettingsView() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
          System & Organization Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure foundation legal profile, contact information, operational
          rules, and biometric attendance criteria.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="org-profile" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl h-10 w-fit">
          <TabsTrigger
            value="org-profile"
            className="gap-2 text-xs font-semibold"
          >
            <Building2 className="h-4 w-4" />
            <span>Organization Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="attendance-rules"
            className="gap-2 text-xs font-semibold"
          >
            <Clock className="h-4 w-4" />
            <span>Attendance & Biometric Rules</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Organization Master Profile */}
        <TabsContent value="org-profile">
          <OrgProfileSettingsForm />
        </TabsContent>

        {/* TAB 2: Attendance & Biometric Rules */}
        <TabsContent value="attendance-rules">
          <AttendancePolicySettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
