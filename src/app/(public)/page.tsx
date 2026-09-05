import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Code2,
  SunMedium,
  Sprout,
  Palette,
  Scissors,
  UtensilsCrossed,
  Users2,
  Building2,
  Fingerprint,
  FileCheck2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function HomePage() {
  const tracks = [
    {
      title: "Software & Cloud Tech",
      icon: Code2,
      tag: "Digital Track",
      desc: "Full-stack web development, mobile apps, database architecture, and cloud deployment foundations.",
      duration: "6 Months",
      color:
        "from-emerald-500/10 to-emerald-500/10 text-primary dark:text-primary border-primary/20",
    },
    {
      title: "Solar & Renewable Energy",
      icon: SunMedium,
      tag: "Green Energy",
      desc: "Photovoltaic system sizing, inverter installation, solar farm maintenance, and clean energy storage.",
      duration: "4 Months",
      color:
        "from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      title: "Modern Agribusiness",
      icon: Sprout,
      tag: "Agriculture",
      desc: "Hydroponics, greenhouse management, livestock nutrition, post-harvest processing, and agro-commerce.",
      duration: "5 Months",
      color:
        "from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    },
    {
      title: "Creative Arts & Digital Media",
      icon: Palette,
      tag: "Creative",
      desc: "UI/UX design, 3D animation, video cinematography, digital marketing, and brand identity design.",
      duration: "4 Months",
      color:
        "from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    },
    {
      title: "Fashion & Garment Technology",
      icon: Scissors,
      tag: "Vocational",
      desc: "Industrial pattern drafting, haute couture tailoring, textile engineering, and fashion enterprise.",
      duration: "6 Months",
      color:
        "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
    {
      title: "Culinary & Hospitality Arts",
      icon: UtensilsCrossed,
      tag: "Hospitality",
      desc: "Continental gastronomy, pastry artistry, food safety standards, and restaurant operations.",
      duration: "4 Months",
      color:
        "from-orange-500/10 to-amber-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Online Application",
      desc: "Select your preferred skill track, choose your nearest training centre, and submit your profile with NIN validation.",
      icon: FileCheck2,
    },
    {
      step: "02",
      title: "Biometric Enrollment",
      desc: "Complete in-person verification and biometric fingerprint capture at your designated training centre.",
      icon: Fingerprint,
    },
    {
      step: "03",
      title: "Immersive Practical Training",
      desc: "Learn from top industry practitioners with state-of-the-art tools, real-world projects, and daily biometric attendance.",
      icon: GraduationCap,
    },
    {
      step: "04",
      title: "Accredited Certification",
      desc: "Graduate with an authentic, QR-verifiable Adele certificate and qualify for enterprise starter kits and job placement.",
      icon: Award,
    },
  ];

  const stats = [
    { value: "50,000+", label: "Youths Trained & Certified", icon: Users2 },
    { value: "12+", label: "Multi-Skill Training Centres", icon: Building2 },
    { value: "100%", label: "Fully Sponsored & Funded", icon: ShieldCheck },
    { value: "94%", label: "Enterprise & Employment Rate", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/60 bg-linear-to-b from-background via-slate-50/50 to-background dark:via-slate-900/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/20 px-3.5 py-1 text-xs font-semibold text-primary dark:text-primary mb-6 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary dark:text-primary" />
              <span>Cohort 2026 Admissions Now Open</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
              Empowering Communities Through{" "}
              <span className="text-primary bg-clip-text">
                Practical Skills
              </span>{" "}
              & Innovation
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Adele Empowerment Foundation delivers fully-funded vocational
              education, digital technology bootcamps, and enterprise starter
              support to drive economic independence across Africa.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-bold shadow-md shadow-primary/20 h-12 px-6"
                >
                  <span>Apply for 2026 Cohort</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/verify/SAMPLE" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm font-semibold h-12 px-6"
                >
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Verify a Certificate</span>
                </Button>
              </Link>
            </div>

            {/* Trust metrics pill */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                No Tuition Fees Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Certified by Adele Foundation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                12 Accredited Regional Centres
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Impact Highlights Strip */}
      <section className="border-b border-border/60 bg-muted/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary mb-1">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Skill & Training Tracks */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Curated Skill Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 tracking-tight">
            High-Demand Vocational & Tech Specializations
          </h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Our intensive curricula combine theoretical knowledge with extensive
            hands-on workshop sessions designed to produce job-ready
            professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((t, idx) => {
            const Icon = t.icon;
            return (
              <Card
                key={idx}
                className="group transition-all duration-300 hover:shadow-lg hover:border-primary/40 border-border/80 flex flex-col justify-between"
              >
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2.5 rounded-xl border bg-linear-to-br ${t.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {t.duration}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {t.title}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground font-medium">
                      {t.tag}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                    {t.desc}
                  </CardDescription>
                  <div className="pt-2 border-t border-border/60">
                    <Link
                      href="/auth/register"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Enroll in this Track</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. How It Works (Candidate Journey) */}
      <section className="border-t border-border/60 bg-slate-50/70 dark:bg-slate-900/40 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              The Adele Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 tracking-tight">
              Your Journey From Application to Career
            </h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              We manage rigorous, transparent enrollment backed by National
              Identity Number (NIN) and biometric attendance verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="relative p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-primary/30 tracking-tight">
                        {st.step}
                      </span>
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Certificate Verification Spotlight */}
      <section className="py-16 md:py-20 border-t border-border/60 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-emerald-500/5 via-emerald-500/5 to-transparent p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary dark:text-primary text-xs font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Instant Employer Verification</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Authentic, Tamper-Proof Adele Credentials
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Every graduate of Adele Empowerment Foundation receives a unique
                certificate serial number with encrypted cryptographic
                verification to eliminate credential fraud.
              </p>
            </div>

            <div className="w-full max-w-md bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground">
                Verify a Graduate's Certificate
              </span>
              <p className="text-xs text-muted-foreground">
                Enter the certificate serial or scan the certificate QR code:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. ADELE-2026-CERT-001"
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
                  readOnly
                  value="ADELE-2026-CERT-001"
                />
                <Link href="/verify/ADELE-2026-CERT-001">
                  <Button size="sm" className="font-bold text-xs gap-1">
                    <span>Verify</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          <GraduationCap className="h-12 w-12 text-primary-foreground/80 mb-4 animate-bounce" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
            Ready to Build Marketable Skills and Secure Your Future?
          </h2>
          <p className="text-sm sm:text-base text-primary-foreground/90 max-w-2xl mb-8 leading-relaxed">
            Join thousands of motivated youth gaining hands-on vocational skills
            and technology expertise with Adele Empowerment Foundation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto font-bold text-sm h-12 px-8 shadow-md"
              >
                Apply for Admission Today
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto font-semibold text-sm h-12 px-8 bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10"
              >
                Existing Candidate Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
