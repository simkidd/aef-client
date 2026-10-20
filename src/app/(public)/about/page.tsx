import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Globe,
  Users,
  Shield,
  Lightbulb,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Award,
  Building2,
  FileCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Adele Empowerment Foundation",
  description:
    "Learn about Adele Empowerment Foundation — our founding story, human-centered values, grassroots team, and commitment to youth development in Nigeria.",
};

const values = [
  {
    icon: Heart,
    title: "Compassion & Dignity",
    desc: "We meet youth and women where they are, honoring their inherent human dignity through respect, active listening, and genuine personal encouragement.",
    accent: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
  {
    icon: Globe,
    title: "Radical Inclusivity",
    desc: "We serve without bias across ethnicity, religion, or background. We prioritize young mothers, school leavers, and marginalized individuals.",
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Lightbulb,
    title: "Practical, Market-Ready Rigor",
    desc: "We do not teach abstract theory. Every syllabus is co-designed with industry craftsmen and vetted against what employers actually hire for.",
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Shield,
    title: "Integrity & Donor Accountability",
    desc: "Every naira and dollar is tracked. Trainees are verified via National Identity Numbers (NIN) and daily biometric fingerprint attendance.",
    accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Users,
    title: "Community Uplift",
    desc: "When one youth is empowered with an earning skill, an entire extended family is lifted out of vulnerability and dependency.",
    accent: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Handshake,
    title: "Collaborative Partnerships",
    desc: "We work hand-in-hand with state governments, master craftsmen, civil society organizations, and corporate employers across Nigeria.",
    accent: "text-teal-500 bg-teal-500/10 border-teal-500/20",
  },
];

const team = [
  {
    name: "Dr. Adwoa Sarpong",
    role: "Executive Director",
    bio: "Former UNICEF education specialist with 20+ years dedicated to community-based vocational training and social uplift in West Africa.",
    initials: "AS",
    color: "from-emerald-600 to-teal-800",
  },
  {
    name: "Kofi Acheampong",
    role: "Head of Vocational Programs",
    bio: "Certified master skills trainer specializing in technical curriculum design, apprenticeship frameworks, and equipment provisioning.",
    initials: "KA",
    color: "from-blue-600 to-indigo-800",
  },
  {
    name: "Esi Boateng",
    role: "Director of Employer Partnerships",
    bio: "Industry liaison lead who builds direct hiring pipelines connecting Adele certified graduates with commercial enterprises.",
    initials: "EB",
    color: "from-amber-600 to-orange-800",
  },
  {
    name: "Yaw Mensah",
    role: "Grassroots Outreach Lead",
    bio: "Community organizer experienced in grassroots mobilization, community head consultations, and candidate onboarding.",
    initials: "YM",
    color: "from-rose-600 to-pink-800",
  },
];

const governancePoints = [
  "Registered Non-Profit with Corporate Affairs Commission (CAC/IT/NO: 148920)",
  "Full compliance with the Special Control Unit Against Money Laundering (SCUML)",
  "Independent annual financial audits published for donors and trustees",
  "Mandatory Child & Vulnerable Adult Safeguarding training for all instructors",
  "Zero-tolerance policy on tuition fees or informal gratification from trainees",
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* 1. Page Hero */}
      <PageHero
        label="Our Story & Mission"
        title="Transforming Lives Through Dignified Skills"
        subtitle="Adele Empowerment Foundation is an authentic grassroots NGO dedicated to equipping youth and women with real, marketable vocations, enterprise kits, and accredited credentials."
        image="/images/auth-hero-social.jpg"
      />

      {/* 2. The Adele Origin Narrative */}
      <section className="py-20 md:py-28 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Real Photography Banner */}
            <div className="relative">
              <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-border">
                <Image
                  src="/images/auth-hero-network.jpg"
                  alt="Adele Foundation students during technical training"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 text-white">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <Award className="h-4 w-4" />
                    <span>Real Classroom Experience</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Students engaging directly with real hardware, tools, and industrial sewing equipment under master instructor supervision.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Narrative */}
            <div className="flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Why We Exist
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-2 mb-6 tracking-tight">
                Closing the Opportunity Gap for Nigerian Youths
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  In communities across Nigeria, millions of bright, energetic young people face systemic roadblocks: prohibitive tertiary education costs, lack of practical workplace apprenticeships, and limited access to professional mentorship.
                </p>
                <p>
                  <strong>Adele Empowerment Foundation</strong> was founded to provide a definitive answer: tuition-free, high-caliber vocational and technological training that directly transforms unemployment into sustainable livelihoods.
                </p>
                <p>
                  We don’t stop at training. Every graduate receives enterprise starter kits, access to alumni cooperative financing, and an authentic, QR-verifiable certificate recognized by employers nationwide.
                </p>
              </div>

              {/* Fast Impact Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 mt-6 border-t border-border/80">
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <p className="text-2xl sm:text-3xl font-black text-primary">50,000+</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Youths Trained</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <p className="text-2xl sm:text-3xl font-black text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Free Tuition</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border col-span-2 sm:col-span-1">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">94%</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Self-Reliance Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core NGO Values */}
      <section className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-900/30 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Our Principles
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
              Values That Guide Our Mission
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3">
              We operate with strict ethical standards, human empathy, and deep accountability to our beneficiaries and donors.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:border-primary/40 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${v.accent} mb-6`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {v.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Leadership & Grassroots Faculty */}
      <section className="py-20 md:py-28 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              The People Behind Adele
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
              Leadership Committed to Service
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3">
              Our leadership brings decades of collective field experience in non-profit education, skills development, and community mobilization.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <div
                key={i}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center transition-all hover:border-primary/30"
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl text-white bg-gradient-to-br ${m.color} shadow-lg mb-4`}
                >
                  {m.initials}
                </div>
                <h3 className="text-base font-bold text-foreground">{m.name}</h3>
                <p className="text-xs font-semibold text-primary mb-3">{m.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Institutional Governance & Accountability */}
      <section className="py-20 md:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <FileCheck className="h-4 w-4" />
                <span>Strict Non-Profit Governance</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Transparency and Trust You Can Rely On
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Adele Empowerment Foundation is governed by an independent Board of Trustees. We adhere to rigorous reporting standards, ensuring all resources directly benefit our youth participants.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-3">
                {governancePoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-200">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="py-20 bg-background text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            Ready to Begin Your Journey with Adele?
          </h2>
          <p className="text-muted-foreground mb-8">
            Admissions for Cohort 2026 are completely free. Select your preferred vocational track and register today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/programs">
              <Button size="lg" className="rounded-full px-8 font-bold bg-primary text-primary-foreground gap-2">
                <span>Explore Programs</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-8 font-bold">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
