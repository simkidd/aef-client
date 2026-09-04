import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ShieldCheck, Award, GraduationCap, ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Adele Empowerment Foundation | Skills Training & Youth Development",
  description:
    "Empowering youth and vulnerable communities with vocational skills, accredited digital training, and enterprise development.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Top Notification Banner */}
      <div className="bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground">
        <span className="inline-flex items-center gap-2">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Cohort 2026 Vocational & Tech Applications are now officially open across all centres!</span>
          <Link href="/auth/register" className="font-bold underline underline-offset-2 hover:opacity-90 ml-1">
            Apply Today &rarr;
          </Link>
        </span>
      </div>

      {/* Main Public Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-10 w-auto" priority />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link
                href="/"
                className="transition-colors hover:text-foreground text-foreground"
              >
                Home
              </Link>
              <Link
                href="/auth/register"
                className="transition-colors hover:text-foreground"
              >
                Available Programs
              </Link>
              <Link
                href="/verify/ADELE-2026"
                className="transition-colors hover:text-foreground flex items-center gap-1"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Verify Certificate
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="font-semibold text-xs sm:text-sm">
                Sign In
              </Button>
            </Link>

            <Link href="/auth/register">
              <Button size="sm" className="gap-1.5 font-bold shadow-sm text-xs sm:text-sm">
                <span>Apply Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Public Page Content */}
      <main className="flex-1">{children}</main>

      {/* Public Footer */}
      <footer className="border-t border-border bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="md:col-span-1 flex flex-col gap-4">
              <Logo className="h-10 w-auto" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Adele Empowerment Foundation is dedicated to transforming lives through accredited vocational training, digital empowerment, and sustainable community advancement.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                Programs & Training
              </h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/auth/register" className="hover:text-foreground transition-colors">
                    Software Development & ICT
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-foreground transition-colors">
                    Solar Tech & Renewable Energy
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-foreground transition-colors">
                    Agribusiness & Processing
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-foreground transition-colors">
                    Fashion Design & Garment Making
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-foreground transition-colors">
                    Culinary Arts & Hospitality
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                Portals & Access
              </h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-foreground transition-colors">
                    Candidate & Beneficiary Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-foreground transition-colors">
                    Staff & Trainer Console
                  </Link>
                </li>
                <li>
                  <Link href="/verify/SAMPLE" className="hover:text-foreground transition-colors flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Public Certificate Verification
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-foreground transition-colors">
                    Application Status Check
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                Support & Inquiries
              </h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Have questions regarding program eligibility or center locations? Reach out to our admissions team.
              </p>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span>Email: admissions@adelefoundation.org</span>
                <span>Toll-free: +234 (0) 800 233 5336</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Adele Empowerment Foundation. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
