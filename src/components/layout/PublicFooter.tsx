"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  GraduationCap,
} from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-slate-950 text-slate-300">
      {/* Upper Impact Strip */}
      <div className="bg-emerald-950/70 border-b border-emerald-900/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Empowerment & Human Capital Development
              </p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Providing free vocational skills, enterprise toolkits, and lifelong community mentorship.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/50 text-xs font-bold transition-colors"
            >
              <span>Explore 6 Vocational Tracks</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span>Partner With Our Foundation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Column 1 & 2: NGO Identity & Mission */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-2xl bg-white/10 w-fit border border-white/10 shrink-0">
                <Logo className="h-10 w-auto" />
              </div>
              <div className="flex flex-col justify-center text-left">
                <p className="font-heading font-black text-base sm:text-lg text-white leading-tight">
                  Adele Empowerment
                </p>
                <p className="font-heading font-bold text-xs text-emerald-400 tracking-[0.2em] uppercase leading-tight mt-0.5">
                  Foundation
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-md mt-2">
              Adele Empowerment Foundation is a grassroots non-profit dedicated to equipping youth, women, and underserved communities with tuition-free vocational skills, accredited digital bootcamps, and starter toolkits to build sustainable livelihoods.
            </p>
          </div>

          {/* Column 3: Vocational Programs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Vocational Tracks
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/programs" className="hover:text-emerald-400 transition-colors">
                  Software & Cloud Engineering
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-emerald-400 transition-colors">
                  Solar & Clean Energy Tech
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-emerald-400 transition-colors">
                  Modern Agribusiness & Processing
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-emerald-400 transition-colors">
                  Fashion Design & Garment Tech
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-emerald-400 transition-colors">
                  Culinary Arts & Hospitality
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-emerald-400 transition-colors">
                  Creative Arts & Digital Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Organization
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-emerald-400 transition-colors">
                  Graduate Success Stories
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-emerald-400 transition-colors">
                  Field Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Training Center Locations
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-emerald-400 transition-colors">
                  Trainee Portal Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-emerald-400 transition-colors text-emerald-400 font-semibold">
                  Free Cohort Application
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Training Centers & Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Regional Hubs
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Lagos HQ:</span>
                  <p className="text-[11px] text-slate-400">12 Adeola Odeku St, Victoria Island, Lagos</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Abuja Hub:</span>
                  <p className="text-[11px] text-slate-400">Plot 45 Aminu Kano Crescent, Wuse 2, Abuja</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <Phone className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <a href="tel:+2348012345678" className="hover:text-white transition-colors text-white font-medium">
                  +234 801 234 5678
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <a href="mailto:info@adelefoundation.org" className="hover:text-white transition-colors">
                  info@adelefoundation.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Transparency & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Adele Empowerment Foundation. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <Link href="/about" className="hover:text-white transition-colors">
              Safeguarding & Ethics
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Donor Accountability
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Whistleblower Channel
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
