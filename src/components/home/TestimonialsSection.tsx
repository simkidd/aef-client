"use client";

import React from "react";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Before Adele Foundation, I had no direction. After 6 months of the Software & Cloud Tech program, I landed a remote role at a Lagos fintech startup. My life has completely changed.",
    name: "Chinedu Okafor",
    role: "Software Developer – Digital Skills Graduate",
    initials: "CO",
    gradient: "from-emerald-500 to-teal-700 text-emerald-100",
    rating: 5,
  },
  {
    quote:
      "The entrepreneurship mentorship sessions helped me transform my tailoring skills into a registered fashion brand. I now employ four others in my community and export to international buyers.",
    name: "Aisha Bello",
    role: "Fashion Entrepreneur – Garment Technology Graduate",
    initials: "AB",
    gradient: "from-rose-500 to-pink-700 text-rose-100",
    rating: 5,
  },
  {
    quote:
      "The biometric and NIN integration gave employers confidence in my credential. My certified solar installation skills helped me secure a contract with a rural electrification project.",
    name: "Emeka Nwankwo",
    role: "Solar Technician – Renewable Energy Graduate",
    initials: "EN",
    gradient: "from-amber-500 to-orange-700 text-amber-100",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-background border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground mt-2 tracking-tight">
            Real Stories. Real Impact.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            Hear directly from graduates who gained practical skills, secured employment,
            and built thriving enterprises across Nigeria and beyond.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/35 hover:-translate-y-2"
            >
              {/* Stars + Quote Icon Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star
                      key={si}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <Quote className="h-8 w-8 fill-primary/15 stroke-primary/25 group-hover:fill-primary/25 transition-colors" />
              </div>

              {/* Quote */}
              <blockquote className="text-sm leading-relaxed text-muted-foreground flex-1 mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Reviewer */}
              <div className="flex items-center gap-3.5 pt-5 border-t border-border/60">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br ${t.gradient} shadow-md ring-2 ring-primary/20 group-hover:ring-primary/60 transition-all flex-shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-primary font-semibold">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
