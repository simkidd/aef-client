"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Fingerprint,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { BeneficiaryProfile } from "@/interfaces";

export default function PortalProfilePage() {
  const { user } = useAuthStore();

  const { data: meData, isLoading } = useQuery({
    queryKey: ["me-profile"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data?.data;
    },
  });

  const profile = meData?.beneficiaryProfile as BeneficiaryProfile;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Permanent Beneficiary Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your centralized institutional profile. You do not need to
            re-register when applying for future programs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Card */}
          <Card className="p-6 space-y-5 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-linear-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center font-bold text-3xl shadow-md">
              {profile?.firstName?.[0] || user?.firstName?.[0] || "B"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {profile?.firstName || user?.firstName}{" "}
                {profile?.lastName || user?.lastName}
              </h2>
              <span className="font-mono text-xs text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20 mt-1 inline-block dark:bg-primary/15 dark:text-primary">
                {profile?.beneficiaryCode || "AEF-BEN-2026"}
              </span>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">
                  {profile?.email || user?.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{profile?.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{profile?.stateOfResidence || "Lagos"}, Nigeria</span>
              </div>
            </div>

            <div className="w-full rounded-xl bg-primary/10 border border-primary/20 p-3 text-primary text-xs flex items-center gap-2 dark:bg-primary/15 dark:border-primary/20 dark:text-primary">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <span>Biometric Identity Token Assigned</span>
            </div>
          </Card>

          {/* Profile Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">
                Personal & Demographic Record
              </CardTitle>
              <CardDescription className="text-xs">
                Verified records linked with training centres and National Board
                for Technical Education accreditations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">
                    Gender
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {profile?.gender || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">
                    Date of Birth
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(profile?.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">
                    Highest Education
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {profile?.highestEducation || "SSCE/WAEC"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">
                    State / LGA of Origin
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {profile?.stateOfOrigin || "Lagos"} /{" "}
                    {profile?.lgaOfOrigin || "Ikeja"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">
                    Employment Status
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {profile?.employmentStatus || "Unemployed"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">
                    ID Document
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {profile?.identificationType || "National NIN"}
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Emergency Contact Person
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Name
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {profile?.emergencyContact?.name || "Mary Eze"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Relationship
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {profile?.emergencyContact?.relationship || "Mother"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Phone
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {profile?.emergencyContact?.phone || "+234 802 999 1234"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
