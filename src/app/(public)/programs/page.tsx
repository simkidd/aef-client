import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import ProgramsCatalog from "@/components/programs/ProgramsCatalog";
import FAQSection from "@/components/shared/FAQSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ArrowRight, Wrench, Award, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Vocational Skills & Training Trades | Adele Empowerment Foundation",
  description:
    "Explore fully funded vocational skills, technical trades, and digital masterclasses — designed with industry craftsmen to equip youth with marketable skills, starter toolkits, and recognized credentials.",
};

export default function ProgramsPage() {
  return (
    <div className="bg-background text-foreground">
      {/* 1. Page Hero */}
      <PageHero
        label="Accredited Skills & Vocations"
        title="Training Built for Real Economic Independence"
        subtitle="Explore our fully funded vocational skills and technical trades — designed with industry craftsmen to equip you with marketable skills, starter toolkits, and recognized credentials."
        image="/images/auth-hero-network.jpg"
      />

      {/* 2. Program Directory Grid (Client Component) */}
      <Suspense fallback={<div className="py-24 text-center text-sm text-muted-foreground">Loading catalog...</div>}>
        <ProgramsCatalog />
      </Suspense>

      {/* 3. What Every Beneficiary Receives */}
      <section className="py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal distance={20} duration={500}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              The Adele Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
              What Every Beneficiary Receives
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Our training is designed to give you end-to-end support from enrollment through business launch.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: "01",
              accent: "bg-emerald-500/20 text-emerald-400",
              title: "Zero Tuition & Fees",
              desc: "100% fully sponsored. All training manuals, workshop tools, and equipment access are provided at zero cost.",
            },
            {
              num: "02",
              accent: "bg-teal-500/20 text-teal-400",
              title: "Starter Toolkits",
              desc: "Graduates receive essential physical tools, equipment, or computing vouchers to immediately launch their enterprise.",
            },
            {
              num: "03",
              accent: "bg-amber-500/20 text-amber-400",
              title: "Biometric Certification",
              desc: "Authentic, QR-verifiable certificate backed by NIN identity checks and verified daily attendance logs.",
            },
            {
              num: "04",
              accent: "bg-blue-500/20 text-blue-400",
              title: "Alumni Network",
              desc: "Access to employer hiring fairs, small business cooperative loans, and lifelong mentor advisory sessions.",
            },
          ].map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 75} distance={18} duration={450}>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 h-full">
                <div className={`h-10 w-10 rounded-xl ${item.accent} flex items-center justify-center font-bold mb-4`}>
                  {item.num}
                </div>
                <h3 className="font-bold text-base text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        </div>
      </section>

      {/* 4. Applicant FAQ Accordion */}
      <FAQSection />
    </div>
  );
}
