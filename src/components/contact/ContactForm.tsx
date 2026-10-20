"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2 } from "lucide-react";
import { TrainingCentre } from "@/interfaces";

const inquiryPurposes = [
  { id: "admission", label: "Program Admission Inquiry" },
  { id: "partner", label: "Corporate Partnership / Hire Graduates" },
  { id: "volunteer", label: "Volunteer Master Instructor" },
  { id: "donor", label: "Donor & Philanthropic Support" },
  { id: "general", label: "General NGO Inquiry" },
];

interface ContactFormProps {
  centres?: TrainingCentre[];
}

export default function ContactForm({ centres = [] }: ContactFormProps) {
  const [purpose, setPurpose] = useState("admission");
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
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in">
        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="font-heading font-black text-xl text-foreground">
          Message Received in Good Order!
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Thank you, <span className="font-bold text-foreground">{formData.name}</span>. An Adele Foundation coordinator will review your inquiry regarding <span className="font-bold text-foreground">{purpose}</span> and contact you shortly.
        </p>
        <Button
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
          className="rounded-full mt-4"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Purpose Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Purpose of Inquiry:
        </label>
        <div className="flex flex-wrap gap-2">
          {inquiryPurposes.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => setPurpose(p.label)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                purpose === p.label
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name & Phone */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g. Samuel Adekunle"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="e.g. +234 801 234 5678"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Email & Nearest Training Center */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="samuel@example.com"
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            Nearest Training Center
          </label>
          <select
            value={formData.center}
            onChange={(e) =>
              setFormData({ ...formData, center: e.target.value })
            }
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Select Nearest Centre (or General)...</option>
            {centres.map((c) => (
              <option key={c._id || c.id || c.centreCode} value={c.name}>
                {c.name} {c.state ? `(${c.state})` : ""}
              </option>
            ))}
            <option value="General / Online Inquiry">General / Remote Inquiry</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1.5">
          How Can We Help You? *
        </label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Please write your questions, vocation interest, or partnership proposal..."
          className="w-full rounded-xl border border-input bg-background p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground gap-2 text-sm shadow-md cursor-pointer"
      >
        {isSubmitting ? (
          <span>Sending Your Inquiry...</span>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Send Official Inquiry</span>
          </>
        )}
      </Button>
    </form>
  );
}
