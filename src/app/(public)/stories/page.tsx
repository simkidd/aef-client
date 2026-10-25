import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
  Quote,
  Star,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  Building2,
  Briefcase,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Success Stories & Impact | Adele Empowerment Foundation",
  description:
    "Real stories of human transformation from Adele Empowerment Foundation graduates — from vocational training to flourishing business enterprises across Nigeria.",
};

const stories = [
  {
    name: "Chinedu Okafor",
    role: "Full-Stack Software Engineer",
    vocation: "Software & Cloud Tech (Cohort 2023)",
    location: "Lagos, Nigeria",
    image: "/images/auth-hero-network.jpg",
    initials: "CO",
    gradient: "from-emerald-600 to-teal-800",
    quote:
      "Before joining Adele Foundation, I had spent two years looking for work without luck. The 6-month software bootcamp gave me hands-on experience and a supportive mentor. Today, I work remotely for a Lagos fintech company and can fully support my parents and pay my younger brother's school fees.",
    outcome: "Employed Full-Time • Tripled Family Household Income",
  },
  {
    name: "Aisha Bello",
    role: "Founder, Bello Haute Couture",
    vocation: "Fashion & Garment Technology (Cohort 2022)",
    location: "Abuja, Nigeria",
    image: "/images/auth-hero-makeup.jpg",
    initials: "AB",
    gradient: "from-rose-600 to-pink-800",
    quote:
      "The starter toolkit with an industrial straight-stitch machine changed everything. During our masterclasses, we learned pricing, client negotiation, and fabric chemistry. I started taking orders right from home, and within one year, I opened my own studio in Wuse. I now employ four apprentice girls from my neighborhood.",
    outcome: "4 Local Apprentices Employed • Operating Studio",
  },
  {
    name: "Emeka Nwankwo",
    role: "Lead Technician, GreenVolt Systems",
    vocation: "Solar & Clean Energy Tech (Cohort 2024)",
    location: "Enugu, Nigeria",
    image: "/images/auth-hero-solar.jpg",
    initials: "EN",
    gradient: "from-amber-600 to-orange-800",
    quote:
      "The biometric attendance and NIN integration made my certification credible to institutional clients. When rural health clinics in Enugu put out a tender for solar battery maintenance, my verified Adele credential proved my practical competency. We successfully retrofitted three community maternity clinics with clean 24/7 power.",
    outcome: "3 Community Clinics Powered • Registered SME",
  },
  {
    name: "Fatima Ibrahim",
    role: "Farm Director, GreenNest Agribusiness",
    vocation: "Modern Agribusiness (Cohort 2023)",
    location: "Kaduna, Nigeria",
    image: "/images/auth-hero-social.jpg",
    initials: "FI",
    gradient: "from-green-600 to-emerald-800",
    quote:
      "I had always wanted to farm, but traditional farming was backbreaking with low yields. At Adele, we learned precision hydroponics and broiler feed formulation. I launched a small greenhouse using my starter kit, and I now supply fresh vegetables and organic eggs to two local supermarket chains every week.",
    outcome: "Supplying 2 Supermarket Chains • Year-Round Harvest",
  },
];

const metrics = [
  { value: "50,000+", label: "Youths Equipped with In-Demand Vocations" },
  { value: "12,000+", label: "Registered Micro-Enterprises Launched" },
  { value: "94%", label: "Graduates Actively Earning After 12 Months" },
  { value: "₦0", label: "Tuition Charged to Any Beneficiary" },
];

export default function StoriesPage() {
  return (
    <div className="bg-background text-foreground">
      {/* 1. Page Hero */}
      <PageHero
        label="Graduate Impact"
        title="Lives Changed, Communities Uplifted"
        subtitle="Behind every statistic is a human story. Discover how Adele Empowerment Foundation graduates are turning practical vocational skills into flourishing businesses and sustainable family livelihoods."
        image="/images/auth-hero-social.jpg"
      />

      {/* 2. Audited Impact Metrics Bar */}
      <section className="py-12 bg-emerald-950 text-white border-y border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {metrics.map((m, idx) => (
              <ScrollReveal key={idx} delay={idx * 75} distance={16} duration={400}>
                <div className="space-y-1">
                  <p className="text-3xl sm:text-5xl font-black text-emerald-400">
                    {m.value}
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                    {m.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Deep Human Stories */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal distance={20} duration={500}>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Alumni Profiles
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
                Real Stories of Perseverance & Dignity
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-3">
                Meet some of the exceptional young Nigerians whose hard work, combined with Adele's practical support, transformed their futures.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-12">
            {stories.map((story, idx) => (
              <ScrollReveal key={idx} delay={100} distance={20} duration={500}>
                <article
                  className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid lg:grid-cols-12"
                >
                  {/* Visual side */}
                  <div className="lg:col-span-5 relative h-72 lg:h-auto min-h-[300px] overflow-hidden bg-slate-900">
                    <Image
                      src={story.image}
                      alt={`${story.name} – Adele Foundation graduate`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        {story.vocation}
                      </p>
                      <p className="text-xl font-black">{story.name}</p>
                      <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-emerald-400" />
                        <span>{story.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Content side */}
                  <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <Quote className="h-8 w-8 text-primary/20" />
                      </div>

                      <blockquote className="text-sm sm:text-base text-foreground leading-relaxed italic mb-8">
                        &ldquo;{story.quote}&rdquo;
                      </blockquote>
                    </div>

                    <div className="pt-6 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br ${story.gradient}`}
                        >
                          {story.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{story.role}</p>
                          <p className="text-xs text-muted-foreground">{story.vocation}</p>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{story.outcome}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Call to Action */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <ScrollReveal distance={20} duration={500}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Become the Next Adele Success Story
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
              Applications for our 2026 fully funded cohort are open across all regional training centers. No application fee is ever charged.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-8 font-bold bg-primary text-primary-foreground gap-2">
                  <span>Apply for Free Training</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/programs">
                <Button size="lg" variant="outline" className="rounded-full px-8 font-bold border-white/20 text-white hover:bg-white/10">
                  Browse All 6 Vocations
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
