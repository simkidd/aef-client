"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Calendar,
  MapPin,
  Building,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/lib/client";
import { formatDate } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../components/ui/card";

export default function PublicVerifyCertificatePage() {
  const params = useParams();
  const code = params?.code as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    const verifyCert = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/certificates/verify/${code}`);
        setData(res.data.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Invalid or unverified certificate code.",
        );
      } finally {
        setLoading(false);
      }
    };
    verifyCert();
  }, [code]);

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-10 flex flex-col items-center justify-center dark:bg-slate-950">
      <div className="max-w-2xl w-full space-y-6">
        {/* Back Link */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Adele Foundation Portal
        </Link>

        {loading ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Verifying Certificate Authenticity...
              </p>
            </div>
          </Card>
        ) : error ? (
          <Card className="border-rose-200 shadow-md">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <XCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl text-rose-800 mt-3">
                Certificate Not Verified
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-emerald-200 shadow-xl overflow-hidden">
            {/* Header Banner */}
            <div className="bg-linear-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs">
                    <Image
                      src="/logos/adele-logo.png"
                      alt="Adele Foundation"
                      width={36}
                      height={36}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    Official Verified Credential
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Status: {data.status}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight mt-4 font-heading">
                {data.skillAreaId?.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {data.programId?.title}
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Recipient Details */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Issued To
                </p>
                <h3 className="text-xl font-bold text-slate-900 mt-1 dark:text-slate-100">
                  {data.beneficiaryId?.firstName} {data.beneficiaryId?.lastName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Beneficiary ID: {data.beneficiaryId?.beneficiaryCode}
                </p>
              </div>

              {/* Credential Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-slate-500">Certificate Number</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5 dark:text-slate-100">
                    {data.certificateNumber}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-slate-500">Issue Date</span>
                  <p className="font-bold text-slate-900 mt-0.5 dark:text-slate-100">
                    {formatDate(data.issueDate)}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-slate-500">Attendance Rate</span>
                  <p className="font-bold text-emerald-700 mt-0.5">
                    {data.overallAttendanceRate}%
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-slate-500">Assessment Grade</span>
                  <p className="font-bold text-teal-700 mt-0.5">
                    {data.grade || "Pass"}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-slate-500">Training Centre</span>
                  <p className="font-bold text-slate-900 mt-0.5 dark:text-slate-100">
                    {data.centreId?.name}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-slate-500">Signatory</span>
                  <p className="font-bold text-slate-900 mt-0.5 dark:text-slate-100">
                    {data.authorizedSignatory?.name}
                  </p>
                </div>
              </div>

              {/* Issuing Authority */}
              <div className="border-t border-slate-200 pt-4 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Issuing Authority: <strong>{data.issuingOrganization}</strong>
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Hash: {data.verificationCode?.substring(0, 12)}...
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
