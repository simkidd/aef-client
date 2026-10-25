"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, ArrowRight, QrCode, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CertificateVerificationSpotlight() {
  const router = useRouter();
  const [serial, setSerial] = useState("ADELE-2026-CERT-001");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (serial.trim()) {
      router.push(`/verify/${encodeURIComponent(serial.trim())}`);
    }
  };

  return (
    <section className="py-20 md:py-24 bg-background border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-primary/25 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/5 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            {/* Left copy */}
            <ScrollReveal direction="right" distance={20} duration={500} className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/25">
                <ShieldCheck className="h-4 w-4" />
                <span>Instant Employer & Global Verification</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
                Authentic, Tamper-Proof Adele Credentials
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Every graduate of Adele Empowerment Foundation is issued an encrypted certificate
                complete with unique serial cryptography and instant QR validation to completely
                eliminate credential falsification.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Real-time NIN & Biometric linked</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Permanent blockchain-backed archival</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Scan via any mobile smartphone</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Free public employer validation</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Interactive Verification Card */}
            <ScrollReveal direction="left" distance={20} duration={500} delay={100} className="lg:col-span-5 w-full">
              <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md p-6 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        Public Certificate Portal
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Validate authenticity in seconds
                      </p>
                    </div>
                  </div>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>

                <form onSubmit={handleVerify} className="space-y-3.5">
                  <label htmlFor="certificate-serial" className="text-xs font-bold text-foreground block">
                    Enter Certificate Serial Number
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="certificate-serial"
                      type="text"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      placeholder="e.g. ADELE-2026-CERT-001"
                      className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm text-foreground font-mono font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-bold gap-2 shadow-md shadow-primary/20 rounded-xl"
                  >
                    <span>Verify Authenticity Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>

                <p className="text-[11px] text-muted-foreground text-center pt-2">
                  Have a printed certificate? Scan the embedded QR code using your smartphone camera for direct access.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
