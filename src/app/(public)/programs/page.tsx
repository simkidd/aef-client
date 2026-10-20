import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import ProgramsCatalog from "@/components/programs/ProgramsCatalog";
import { Button } from "@/components/ui/button";
import { ArrowRight, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Vocational Programs & Digital Tracks | Adele Empowerment Foundation",
  description:
    "Explore fully funded vocational and technological training programs — designed with industry craftsmen to equip youth with marketable skills, starter toolkits, and recognized credentials.",
};

const faqs = [
  {
    q: "Are these programs really 100% tuition-free?",
    a: "Yes. Adele Empowerment Foundation is an accredited non-profit NGO funded by philanthropic endowments and corporate partners. Trainees NEVER pay tuition, registration fees, or certification charges.",
  },
  {
    q: "Who is eligible to apply for Cohort 2026?",
    a: "Applicants must be Nigerian youths aged 18 to 35 with a valid National Identity Number (NIN). No prior university degree is required — only genuine passion, dedication, and punctuality.",
  },
  {
    q: "How does the biometric attendance work?",
    a: "To ensure fairness and prevent ghost beneficiaries, every trainee clocks in daily using biometric fingerprint verification. A minimum 85% attendance rate is mandatory to receive certificates and starter toolkits.",
  },
  {
    q: "What starter kit do I receive upon graduation?",
    a: "Every verified graduate receives an enterprise starter toolkit tailored to their vocation — such as industrial sewing machines, electrical testing sets, seed packs, or compute tools to immediately launch their trade.",
  },
];

export default function ProgramsPage() {
  return (
    <div className="bg-background text-foreground">
      {/* 1. Page Hero */}
      <PageHero
        label="Accredited Vocations"
        title="Training Built for Real Economic Independence"
        subtitle="Explore our fully funded vocational and technological training programs — designed with industry craftsmen to equip you with marketable skills, starter toolkits, and recognized credentials."
        image="/images/auth-hero-network.jpg"
      />

      {/* 2. Program Directory Grid (Client Component) */}
      <ProgramsCatalog />

      {/* 3. What Every Beneficiary Receives */}
      <section className="py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="font-bold text-base text-white mb-2">Zero Tuition &amp; Fees</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                100% fully sponsored. All training manuals, workshop tools, and equipment access are provided at zero cost.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="h-10 w-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="font-bold text-base text-white mb-2">Starter Toolkits</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Graduates receive essential physical tools, equipment, or computing vouchers to immediately launch their enterprise.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="font-bold text-base text-white mb-2">Biometric Certification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Authentic, QR-verifiable certificate backed by NIN identity checks and verified daily attendance logs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-4">
                04
              </div>
              <h3 className="font-bold text-base text-white mb-2">Alumni Network</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Access to employer hiring fairs, small business cooperative loans, and lifelong mentor advisory sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Applicant FAQ Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Common Questions
            </span>
            <h2 className="text-3xl font-black text-foreground mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <h3 className="font-bold text-foreground text-base">{faq.q}</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground pl-8 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/register">
              <Button size="lg" className="rounded-full px-8 font-bold bg-primary text-primary-foreground gap-2">
                <span>Start Your Free Application Now</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
