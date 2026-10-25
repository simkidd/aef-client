"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";

export interface FAQItem {
  q: string;
  a: string;
  category?: string;
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    q: "Are these vocational programs really 100% tuition-free?",
    a: "Yes, absolutely. Adele Empowerment Foundation is an accredited non-profit NGO funded by philanthropic endowments, donor grants, and corporate partners. Trainees NEVER pay tuition, examination fees, registration costs, or certification charges at any point.",
  },
  {
    q: "Who is eligible to apply for admission?",
    a: "Programs are open to Nigerian youths and young adults (ages 18–35) with a valid National Identity Number (NIN). No prior university degree or technical background is required — only genuine dedication, willingness to learn hands-on trades, and punctual attendance.",
  },
  {
    q: "What starter kit do I receive upon graduation?",
    a: "Every verified graduate receives a complete, professional-grade starter toolkit tailored to their vocation — such as industrial sewing machines for fashion designers, digital multimeter & toolsets for solar technicians, computing devices, or agribusiness setups — so you can immediately establish your trade.",
  },
  {
    q: "How does the biometric attendance work?",
    a: "To ensure fairness, dedication, and prevent ghost beneficiaries, every trainee clocks in daily using biometric fingerprint verification. A minimum 85% attendance rate across the cohort duration is mandatory to qualify for graduation and starter toolkits.",
  },
  {
    q: "Where are the physical training centres located?",
    a: "We operate fully accredited regional training hubs equipped with modern workshop tools, renewable solar power, and experienced master instructors in Port Harcourt, Lagos, and Abuja, with outreach centres expanding across Nigeria.",
  },
  {
    q: "Can I enroll in more than one skill track at the same time?",
    a: "Because our courses require intensive practical workshop participation, candidates can only enroll in one active vocational trade per cohort. Once certified, you can access advanced masterclasses and our alumni cooperative network.",
  },
];

interface FAQSectionProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
  label?: string;
  className?: string;
  showApplyCTA?: boolean;
}

export default function FAQSection({
  items = DEFAULT_FAQS,
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about our tuition-free vocational trades, admissions eligibility, and starter toolkits.",
  label = "Got Questions?",
  className,
  showApplyCTA = true,
}: FAQSectionProps) {
  // Allow toggling open/closed items with first item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faqs" className={cn("py-20 md:py-28 bg-background relative overflow-hidden", className)}>
      {/* Subtle background ambient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal distance={20} duration={500}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
              <MessageCircleQuestion className="h-3.5 w-3.5" />
              <span>{label}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Accordion Container */}
        <ScrollReveal delay={80} distance={20} duration={500}>
          <div className="space-y-3.5">
            {items.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-2xl border transition-all duration-300 overflow-hidden",
                    isOpen
                      ? "border-primary/40 bg-card shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                      : "border-border/80 bg-card/60 hover:border-primary/30 hover:bg-card"
                  )}
                >
                  {/* Accordion Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors select-none"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                      <div
                        className={cn(
                          "h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200",
                          isOpen
                            ? "bg-primary text-primary-foreground shadow-xs shadow-primary/30"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <HelpCircle className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </div>
                      <span
                        className={cn(
                          "font-heading font-bold text-sm sm:text-base transition-colors duration-200 leading-snug",
                          isOpen ? "text-primary" : "text-foreground"
                        )}
                      >
                        {faq.q}
                      </span>
                    </div>

                    {/* Rotating Chevron Icon */}
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border",
                        isOpen
                          ? "bg-primary/10 border-primary/30 text-primary rotate-180"
                          : "bg-muted/40 border-border/60 text-muted-foreground rotate-0"
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Animated Accordion Content Panel using CSS Grid transition */}
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-1 sm:pl-[4.5rem]">
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Micro-CTA Footer */}
        {showApplyCTA && (
          <ScrollReveal delay={120} distance={16}>
            <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-border/80 bg-muted/30 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  Have a question not listed here?
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Reach out to our admissions hotline or talk directly with our training coordinators.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <Link href="/contact">
                  <button
                    type="button"
                    className="h-11 px-6 rounded-full text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>Contact Support</span>
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button
                    type="button"
                    className="h-11 px-6 rounded-full text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 hover:scale-105 active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
