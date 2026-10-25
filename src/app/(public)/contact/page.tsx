import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import { TrainingCentre } from "@/interfaces";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Building2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { centreApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact Us | Adele Empowerment Foundation",
  description:
    "Direct communication channels for prospective beneficiaries, hiring partners, volunteer instructors, and community organizations across Nigeria.",
};

const defaultOffices = [
  {
    name: "Adele TVET Excellence Centre (Port Harcourt)",
    badge: "Flagship Training Hub",
    address: "Plot 12, Trans-Amadi Industrial Layout, Port Harcourt, Rivers State",
    phone: "+234 802 111 0001",
    email: "ph.centre@adelefoundation.org",
    hours: "Mon – Fri: 8:00 AM – 5:00 PM",
  },
  {
    name: "Adele Vocational & Technical Hub (Yenagoa)",
    badge: "Regional Training Centre",
    address: "Mbiama-Yenagoa Road, Ekeki, Yenagoa, Bayelsa State",
    phone: "+234 802 111 0002",
    email: "yenagoa.centre@adelefoundation.org",
    hours: "Mon – Fri: 8:00 AM – 4:30 PM",
  },
  {
    name: "Lagos Liaison Office",
    badge: "National Liaison Desk",
    address: "Plot 104, Central Business District, Ikeja, Lagos",
    phone: "+234 801 234 5678",
    email: "info@adelefoundation.org",
    hours: "Mon – Fri: 8:00 AM – 5:00 PM",
  },
];

export default async function ContactPage() {
  let centres: TrainingCentre[] = [];
  try {
    const res = await centreApi.getAll();
    centres = res?.data || [];
  } catch {
    centres = [];
  }

  // Use dynamic centres if available, otherwise fallback to standard hubs
  const displayedHubs =
    centres.length > 0
      ? centres.slice(0, 3).map((c, i) => ({
          name: c.name,
          badge:
            c.centreCode || (i === 0 ? "Flagship Hub" : "Accredited Centre"),
          address:
            c.address || `${c.lga || "Central"}, ${c.state || "Nigeria"}`,
          phone: c.contactPhone || "+234 801 234 5678",
          email: c.contactEmail || "admissions@adelefoundation.org",
          hours: "Mon – Fri: 8:00 AM – 5:00 PM",
        }))
      : defaultOffices;

  return (
    <div className="bg-background text-foreground">
      {/* 1. Minimal Page Hero */}
      <PageHero
        label="Contact & Inquiries"
        title="We're Here to Help"
        subtitle="Direct channels for prospective trainees, hiring partners, volunteer instructors, and community organizations across Nigeria."
        image="/images/auth-hero-social.jpg"
      />

      {/* 2. Core Contact Grid: Direct Info + Minimalist Form */}
      <section className="py-16 md:py-20 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: Direct Information & Credentials */}
            <ScrollReveal
              direction="right"
              distance={18}
              duration={400}
              className="lg:col-span-5 space-y-6"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Direct Communication
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Get in touch with our team
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Have questions regarding upcoming batch intakes, candidate
                  eligibility, or vocational sponsorships? Reach out directly
                  via our central desk.
                </p>
              </div>

              {/* Minimal Channels Card List */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                {/* Channel 1: Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Admissions Helpline &amp; WhatsApp
                    </p>
                    <a
                      href="tel:+2348012345678"
                      className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors block mt-0.5"
                    >
                      +234 801 234 5678
                    </a>
                    <span className="text-[11px] text-muted-foreground">
                      Mon – Fri, 8:00 AM – 5:00 PM (WAT)
                    </span>
                  </div>
                </div>

                <div className="border-t border-border/60" />

                {/* Channel 2: Official Email */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Official Email
                    </p>
                    <a
                      href="mailto:info@adelefoundation.org"
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors block mt-0.5"
                    >
                      info@adelefoundation.org
                    </a>
                  </div>
                </div>

                <div className="border-t border-border/60" />

                {/* Channel 3: Address */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Address
                    </p>
                    <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                      Plot 12, Trans-Amadi Industrial Layout, Port Harcourt, Rivers State, Nigeria
                    </p>
                  </div>
                </div>
              </div>

              {/* Minimal Beneficiary Notice */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 text-xs">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">
                    100% Tuition-Free Promise:
                  </strong>{" "}
                  Adele Foundation programs are fully funded. No staff or
                  partner is permitted to request enrollment or toolkit fees.
                </p>
              </div>

              {/* Legal status */}
              <p className="text-[11px] text-muted-foreground text-center sm:text-left">
                Registered Incorporated Trustee under CAMA 2020 •{" "}
                <span className="font-mono font-semibold text-foreground">
                  CAC/IT/NO: 148920
                </span>
              </p>
            </ScrollReveal>

            {/* Right: Minimalist Form */}
            <ScrollReveal
              direction="left"
              distance={18}
              duration={400}
              delay={80}
              className="lg:col-span-7"
            >
              <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-9 shadow-xs">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Send an Inquiry
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Fill out the form below and an admissions officer or
                    coordinator will respond within 24 business hours.
                  </p>
                </div>

                <ContactForm centres={centres} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. Regional Training Hubs (Minimal & Compact Directory) */}
      <section className="py-16 md:py-20 bg-muted/20 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal distance={16} duration={400}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Regional Locations
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1 tracking-tight">
                  Our Training Hubs &amp; Offices
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                Equipped with workshop bays, safety gear, biometric clock-in,
                and certified faculty.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {displayedHubs.map((hub, idx) => (
              <ScrollReveal
                key={idx}
                delay={idx * 60}
                distance={14}
                duration={350}
              >
                <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {hub.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground mb-3 font-heading">
                      {hub.name}
                    </h3>

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{hub.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                        <a
                          href={`tel:${hub.phone}`}
                          className="hover:text-foreground font-medium transition-colors"
                        >
                          {hub.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                        <a
                          href={`mailto:${hub.email}`}
                          className="hover:text-foreground transition-colors"
                        >
                          {hub.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{hub.hours}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Minimal FAQs / Help Banner */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal distance={14} duration={350}>
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 hidden sm:flex">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Have questions about courses or admission criteria?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Browse program details, eligibility criteria, and starter
                    toolkit benefits.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center">
                <Link href="/programs" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs transition-all hover:scale-105 cursor-pointer">
                    <span>Explore Programs</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
