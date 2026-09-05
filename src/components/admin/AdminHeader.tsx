"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../ui/theme-toggle";
import { useAuthStore } from "@/stores/auth.store";
import { BiometricSimulatorModal } from "./BiometricSimulatorModal";

export function AdminHeader() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          {/* Mobile drawer trigger */}
          <SidebarTrigger className="md:hidden h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 rounded-lg" />

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Central Engine Live
          </span>
          <span className="text-xs text-slate-300 dark:text-slate-700 hidden sm:inline">
            |
          </span>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden sm:inline">
            Scope:{" "}
            <strong className="text-slate-900 dark:text-slate-100">
              {user?.scopeAssignments?.[0]?.scopeType || "GLOBAL"}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trigger Biometric Hardware Simulator */}
          <Button
            size="sm"
            onClick={() => setIsSimulatorOpen(true)}
            className="gap-2 bg-linear-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white shadow-xs text-xs font-semibold"
          >
            <Fingerprint className="h-4 w-4" />
            <span className="hidden sm:inline">Biometric Simulator</span>
          </Button>

          {/* Link to Public / Beneficiary portal */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/portal")}
            className="gap-1.5 text-xs text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hidden md:flex"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Beneficiary Portal
          </Button>

          {/* Theme Mode Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Hardware simulator dialog */}
      <BiometricSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onScanSuccess={() => {
          // Triggered on successful simulated biometric scan
        }}
      />
    </>
  );
}
