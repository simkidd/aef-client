"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MapPin, Phone, Mail, ArrowRight, Heart } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-slate-950 text-slate-300">
      {/* Upper Impact CTA Strip */}
      <div className="bg-emerald-950/60 border-b border-emerald-900/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-base sm:text-lg font-bold text-white tracking-tight">
              Ready to Build a High-Demand Skill?
            </p>
            <p className="text-xs text-emerald-300/85 mt-1 max-w-xl">
              Tuition-free training, practical workshop toolkits, and recognized certification.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-[0.98] cursor-pointer"
            >
              <span>Apply for Training</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/programs"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-semibold transition-all hover:scale-105 active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Skills</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-full text-xs font-semibold text-emerald-300 hover:text-white transition-colors cursor-pointer"
            >
              <Heart className="h-3.5 w-3.5 text-rose-400" />
              <span>Partner With Us</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & Purpose */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <div className="p-2 rounded-xl bg-white w-fit shadow-xs shrink-0 flex items-center justify-center">
                <Logo className="h-9 w-auto" />
              </div>
              <div className="flex flex-col justify-center text-left">
                <p className="font-heading font-black text-base text-white leading-tight">
                  Adele Empowerment
                </p>
                <p className="font-heading font-bold text-[11px] text-primary tracking-[0.2em] uppercase leading-tight mt-0.5">
                  Foundation
                </p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400">
              Equipping youth, women, and underserved communities with tuition-free vocational skills, accredited digital bootcamps, and enterprise starter toolkits.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Explore
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/programs" className="hover:text-primary transition-colors">
                  Vocational Skills
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-primary transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary transition-colors">
                  Field Photo Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Admissions & Portal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Admissions
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/auth/register" className="text-primary font-semibold hover:text-primary/90 transition-colors">
                  Apply for Training
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-primary transition-colors">
                  Trainee Portal Login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Partner / Sponsor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us (Properly Positioned) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Contact Us
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Regional Training Centres across Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+2348012345678" className="hover:text-white transition-colors">
                  +234 801 234 5678
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:info@adelefoundation.org" className="hover:text-white transition-colors">
                  info@adelefoundation.org
                </a>
              </div>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-all"
                >
                  <span>Get in Touch</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Theme Toggle & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p>
              &copy; {new Date().getFullYear()} Adele Empowerment Foundation. All rights reserved.
            </p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <p className="text-[11px] text-slate-500">
              Built by{" "}
              <a
                href="https://ionidev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-primary transition-colors font-medium underline underline-offset-2"
              >
                iOnidev
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Terms of Training
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <span className="text-[10px] text-slate-500 font-medium">Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
