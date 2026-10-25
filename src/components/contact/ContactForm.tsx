"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { TrainingCentre } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";

const inquiryPurposes = [
  { id: "admission", label: "Program Admission" },
  { id: "partner", label: "Partnership / Hiring" },
  { id: "volunteer", label: "Volunteer Instructor" },
  { id: "general", label: "General Inquiry" },
];

interface ContactFormProps {
  centres?: TrainingCentre[];
}

export default function ContactForm({ centres = [] }: ContactFormProps) {
  const [purpose, setPurpose] = useState("Program Admission");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    center: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 sm:p-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-4"
          >
            <div className="h-14 w-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading font-bold text-xl text-foreground">
                Inquiry Received
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-foreground">{formData.name}</span>. An Adele Foundation representative will review your message regarding <span className="font-semibold text-foreground">{purpose}</span> and respond within 24 business hours.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  center: "",
                  message: "",
                });
              }}
              variant="outline"
              size="sm"
              className="rounded-full mt-2 text-xs font-semibold"
            >
              Send Another Inquiry
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Email */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Samuel Adekunle"
                  className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="samuel@example.com"
                  className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Phone & Purpose / Topic */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+234 800 000 0000"
                  className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-foreground">
                  Purpose of Inquiry
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {inquiryPurposes.map((p) => (
                    <option key={p.id} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-foreground">
                Message <span className="text-primary">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Tell us what you need help with..."
                className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-sm shadow-md shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}
