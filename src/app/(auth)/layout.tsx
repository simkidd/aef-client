import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Logo from "@/components/shared/Logo";
import AuthCarousel from "@/components/auth/AuthCarousel";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "Sign In — Adele Empowerment Foundation",
  description: "Sign in to Adele Empowerment Foundation.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50/70 dark:bg-slate-950 text-foreground selection:bg-primary/20 selection:text-primary dark:selection:text-primary overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* 1. Left Editorial Mission & Community Showcase Carousel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-6/12 h-full relative bg-slate-950 text-white overflow-hidden border-r border-border shrink-0">
        <AuthCarousel />
      </div>

      {/* 2. Right Form Column */}
      <div className="flex-1 h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto relative bg-slate-50/70 dark:bg-slate-950">
        {/* Top Control Bar: Mobile Branding + Theme Toggle */}
        <div className="w-full flex items-center justify-between lg:justify-end mb-4">
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/"
              title="Return to Foundation Home"
              className="inline-flex items-center gap-2 group"
            >
              <Logo className="h-9 w-auto group-hover:scale-105 transition-transform" />
            </Link>
            <div className="text-left">
              <p className="text-xs font-bold tracking-tight text-foreground leading-none">
                ADELE FOUNDATION
              </p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                Skills Training
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="rounded-lg border border-border bg-card hover:bg-muted text-foreground h-9 w-9 shadow-2xs" />
          </div>
        </div>

        {/* Form Viewport Stage */}
        <div className="flex-1 flex items-center justify-center my-auto w-full py-2">
          <div className="w-full flex justify-center">{children}</div>
        </div>

        {/* Subtle Bottom Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}
