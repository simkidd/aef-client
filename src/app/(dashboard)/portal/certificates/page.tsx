"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  ShieldCheck,
  Download,
  ExternalLink,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { Certificate } from "@/interfaces";

export default function PortalCertificatesPage() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: async () => {
      const res = await api.get("/certificates");
      return res.data?.data as Certificate[];
    },
  });

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            My Verifiable Certificates & Credentials
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official accredited certificates issued by Adele Empowerment
            Foundation with cryptographic verification tokens.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Loading certificates...
          </div>
        ) : certificates && certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <Card
                key={cert._id}
                className="border-primary/20 shadow-md overflow-hidden dark:border-primary/20"
              >
                {/* Header Banner */}
                <div className="bg-linear-to-r from-emerald-800 to-slate-900 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
                      {cert.certificateNumber}
                    </span>
                    <span className="text-xs bg-primary/20 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                      {cert.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight mt-3">
                    {cert.skillAreaId?.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {cert.programId?.title}
                  </p>
                </div>

                <CardContent className="p-6 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Issue Date
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatDate(cert.issueDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Assessment Grade
                      </span>
                      <span className="font-semibold text-primary">
                        {cert.grade || "Pass"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Attendance Rate
                      </span>
                      <span className="font-semibold text-primary">
                        {cert.overallAttendanceRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Training Centre
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {cert.centreId?.name}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                          Public Verification Code
                        </p>
                        <p className="font-mono text-[11px] text-slate-500">
                          {cert.verificationCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(`/verify/${cert.verificationCode}`, "_blank")
                    }
                    className="gap-1.5 text-xs text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Public Verification Link
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs"
                  >
                    View Certificate
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Certificates Issued Yet"
            description="Certificates are automatically generated upon successful completion of your training cohort and passing assessments."
          />
        )}
      </div>
    </>
  );
}
