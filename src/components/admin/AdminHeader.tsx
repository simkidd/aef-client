"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Fingerprint } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../ui/theme-toggle";
import { useAuthStore } from "@/stores/auth.store";
import { BiometricSimulatorModal } from "./BiometricSimulatorModal";

import { NotificationDropdown } from "../common/NotificationDropdown";

export function AdminHeader() {
  const { user } = useAuthStore();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          {/* Mobile drawer trigger */}
          <SidebarTrigger className="md:hidden h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 rounded-lg" />

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/15 dark:text-primary dark:border-primary/20">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
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
          {/* Launch Biometric Attendance Terminal */}
          <Link href="/terminal">
            <Button
              size="sm"
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs text-xs font-semibold"
            >
              <Fingerprint className="h-4 w-4" />
              <span className="hidden md:inline">Attendance Terminal</span>
              <span className="md:hidden">Terminal</span>
            </Button>
          </Link>

          {/* Trigger Biometric Hardware Simulator */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSimulatorOpen(true)}
            className="gap-1.5 text-xs font-semibold hidden sm:inline-flex"
          >
            <span>Simulator</span>
          </Button>

          {/* Notifications */}
          <NotificationDropdown />

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
