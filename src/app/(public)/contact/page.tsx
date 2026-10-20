import React from "react";
import { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import { TrainingCentre } from "@/interfaces";
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Building2,
  ShieldAlert,
  Users,
} from "lucide-react";

import { centreApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact Us | Adele Empowerment Foundation",
  description:
    "Get in touch with Adele Empowerment Foundation admissions coordinators, training hub directors, or partnership coordinators across our accredited regional centres.",
};

export default async function ContactPage() {
  let centres: TrainingCentre[] = [];
  try {
    const res = await centreApi.getAll();
    centres = res?.data || [];
  } catch {
    centres = [];
  }

  return (
    <div className="bg-background text-foreground">
      {/* 1. Page Hero */}
      <PageHero
        label="Direct NGO Channels"
        title="We Welcome Your"
        titleAccent="Inquiries & Partnerships"
        subtitle="Our regional vocational training hubs and admissions offices are open to candidates, community partners, and donors across Nigeria."
        image="/images/auth-hero-social.jpg"
      />

      {/* 2. Main Contact Form & Direct Inquiries */}
      <section className="py-20 md:py-28 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Interactive Form (Client Component with dynamic centres from admin) */}
            <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Reach Out Directly
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-foreground mt-2 mb-4 tracking-tight">
                Send an Official Message
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-8 leading-relaxed">
                Fill in the details below. Our admissions or partnerships secretariat typically responds within one business day.
              </p>

              <ContactForm centres={centres} />
            </div>

            {/* Right: Quick Direct Info & Trust Policy */}
            <div className="lg:col-span-5 space-y-6">
              {/* Admissions Hotline Card */}
              <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Phone className="h-4 w-4" />
                  <span>Immediate Center Hotline</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-foreground">
                  +234 801 234 5678
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Call Monday to Friday from 8:00 AM to 5:00 PM to speak with an admissions officer regarding eligibility, batch schedules, and center orientations.
                </p>
                <div className="pt-4 border-t border-primary/20 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>WhatsApp Helpdesk Available on Same Number</span>
                </div>
              </div>

              {/* Zero-Tolerance Fee Alert */}
              <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Beneficiary Protection Notice</span>
                </div>
                <h3 className="font-bold text-foreground text-sm">
                  Adele Programs Are 100% Free
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No instructor, staff member, or third party is permitted to charge application fees, training fees, or kit charges. If anyone requests money on behalf of Adele Foundation, report immediately to{" "}
                  <a
                    href="mailto:ethics@adelefoundation.org"
                    className="font-bold underline text-foreground"
                  >
                    ethics@adelefoundation.org
                  </a>
                  .
                </p>
              </div>

              {/* Official Registration */}
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-2 text-xs text-muted-foreground">
                <p className="font-bold text-foreground text-sm">
                  Corporate Affairs Commission Status:
                </p>
                <p>
                  Adele Empowerment Foundation is registered as an Incorporated Trustee under Part F of CAMA 2020 (<span className="font-mono font-bold text-foreground">CAC/IT/NO: 148920</span>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Regional Training Hubs (Managed Dynamically from Admin Dashboard) */}
      <section className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Visit Us in Person
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
              Our Regional Training Hubs
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3">
              Every facility features dedicated workshop spaces, biometric clock-in gates, and experienced master instructors.
            </p>
          </div>

          {centres.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {centres.map((centre) => (
                <div
                  key={centre._id || centre.id || centre.centreCode}
                  className="rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        <span>{centre.state}</span>
                      </div>
                      {centre.centreCode && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                          {centre.centreCode}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-black text-xl text-foreground mb-4">
                      {centre.name}
                    </h3>

                    <div className="space-y-3 text-xs text-muted-foreground">
                      {centre.address && (
                        <div className="flex items-start gap-2.5">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{centre.address}</span>
                        </div>
                      )}

                      {centre.contactPhone && (
                        <div className="flex items-center gap-2.5">
                          <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                          <a
                            href={`tel:${centre.contactPhone}`}
                            className="hover:text-foreground font-semibold"
                          >
                            {centre.contactPhone}
                          </a>
                        </div>
                      )}

                      {centre.contactEmail && (
                        <div className="flex items-center gap-2.5">
                          <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                          <a
                            href={`mailto:${centre.contactEmail}`}
                            className="hover:text-foreground"
                          >
                            {centre.contactEmail}
                          </a>
                        </div>
                      )}

                      {centre.capacity ? (
                        <div className="flex items-center gap-2.5 pt-2 border-t border-border/60">
                          <Users className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>Facility Capacity: {centre.capacity} Trainees</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {centre.lga ? (
                    <div className="mt-6 pt-4 border-t border-border/60">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-1">
                        Regional Location:
                      </p>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {centre.lga}, {centre.state}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center max-w-2xl mx-auto space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="font-heading font-black text-xl text-foreground">
                Regional Hubs Managed Centrally
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Accredited regional training centers and multi-skill hubs are managed and scheduled directly from the Foundation administrative dashboard. For immediate centre allocation inquiries or facility orientations, reach out to our central desk above.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
